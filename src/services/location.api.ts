import axios, { AxiosRequestConfig } from 'axios';
import { api } from './api';
import {
  CapturedLocation, hasValidCoordinates, LocationResult, NormalizeLocationPayload,
} from '@/types/location.types';

export class LocationRequestError extends Error {
  constructor(public status: number, message: string, public retryAt = 0) {
    super(message);
    this.name = 'LocationRequestError';
  }
}

// Shared across mounted pickers, but never persisted with addresses or coordinates.
let cooldownUntil = 0;

async function request(path: string, config: AxiosRequestConfig = {}): Promise<unknown> {
  if (Date.now() < cooldownUntil) {
    throw new LocationRequestError(429, 'Too many location requests. Please wait before trying again.', cooldownUntil);
  }
  try {
    const response = await api.request({
      ...config, url: `/v1/location${path}`, timeout: 70000,
    });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) throw error;
    const status = error.response?.status ?? 0;
    if (status === 429) {
      const header = error.response?.headers['retry-after'];
      const seconds = Number(header);
      const delay = header && Number.isFinite(seconds)
        ? Math.max(0, seconds * 1000)
        : header ? Math.max(0, Date.parse(String(header)) - Date.now()) : 60000;
      cooldownUntil = Date.now() + (Number.isFinite(delay) ? delay : 60000);
    }
    const messages: Record<number, string> = {
      400: 'The location details were not accepted. Check the address and try again.',
      401: 'The location service is unavailable. Please contact your administrator.',
      404: 'No address was found for these coordinates. Your GPS capture is retained; try searching your address.',
      429: 'Too many location requests. Please wait before trying again.',
      502: 'The location provider is temporarily unavailable. Please try again.',
      503: 'The location service is unavailable or not configured. Please try again later.',
    };
    // Do not expose Axios config, provider errors, keys, or sensitive request data.
    throw new LocationRequestError(status, messages[status]
      ?? 'Unable to reach the location service. Please try again.', status === 429 ? cooldownUntil : 0);
  }
}

function result(value: unknown): LocationResult {
  if (!hasValidCoordinates(value)
    || (value.address !== undefined && typeof value.address !== 'string')) {
    throw new LocationRequestError(502, 'The location service returned an unexpected result.');
  }
  return value;
}

function resultList(body: unknown): LocationResult[] {
  if (!body || typeof body !== 'object' || !('results' in body) || !Array.isArray(body.results)) {
    throw new LocationRequestError(502, 'The location response format is not supported. Please contact your administrator.');
  }
  return body.results.map(result);
}

export const locationApi = {
  health: async (signal?: AbortSignal) => {
    const body = await request('/health', { signal });
    if (!body || typeof body !== 'object' || !('ok' in body) || !('providerConfigured' in body)
      || body.ok !== true || body.providerConfigured !== true) {
      throw new LocationRequestError(503, 'The location service is not ready.');
    }
    return body;
  },
  geocode: async (address: string, signal?: AbortSignal) => {
    const trimmed = address.trim();
    if (!trimmed || trimmed.length > 500) {
      throw new LocationRequestError(400, 'Enter an address of up to 500 characters.');
    }
    return resultList(await request('/geocode', {
      method: 'POST', data: { address: trimmed, limit: 5 }, signal,
    }));
  },
  reverse: async (latitude: number, longitude: number, signal?: AbortSignal) => {
    if (!hasValidCoordinates({ latitude, longitude })) {
      throw new LocationRequestError(400, 'Invalid location coordinates.');
    }
    return result(await request('/reverse', { params: { latitude, longitude }, signal }));
  },
  // Deliberately not used by the picker until the API owner confirms its envelope.
  autocomplete: async (text: string, signal?: AbortSignal): Promise<unknown> => {
    if (text.trim().length < 3 || text.trim().length > 500) {
      throw new LocationRequestError(400, 'Enter between 3 and 500 characters.');
    }
    return request('/autocomplete', { params: { text: text.trim(), limit: 5 }, signal });
  },
  normalize: async (capture: NormalizeLocationPayload, signal?: AbortSignal): Promise<CapturedLocation> => {
    if (!hasValidCoordinates(capture) || !Number.isFinite(capture.accuracy_m)
      || capture.accuracy_m < 0 || !capture.captured_at.endsWith('Z')
      || !Number.isFinite(Date.parse(capture.captured_at))) {
      throw new LocationRequestError(400, 'Invalid GPS capture. Please capture your location again.');
    }
    const body = await request('/normalize', { method: 'POST', data: capture, signal });
    if (!body || typeof body !== 'object' || !('success' in body) || body.success !== true
      || !('location' in body)) {
      throw new LocationRequestError(502, 'The location service returned an incomplete GPS record.');
    }
    const location = result(body.location);
    const metadata = body.location as CapturedLocation;
    if (location.latitude !== capture.latitude || location.longitude !== capture.longitude
      || metadata.accuracy_m !== capture.accuracy_m
      || metadata.captured_at !== capture.captured_at || metadata.source !== 'device_geolocation') {
      throw new LocationRequestError(502, 'The location service did not preserve the GPS capture. Please retry.');
    }
    return { ...location, ...capture, source: 'device_geolocation' };
  },
};
