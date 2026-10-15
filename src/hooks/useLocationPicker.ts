import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { locationApi, LocationRequestError } from '@/services/location.api';
import {
  CapturedLocation, isCompleteLocation, LocationResult,
  NormalizeLocationPayload, SelectedLocation,
} from '@/types/location.types';

export function captureDevicePosition(): Promise<NormalizeLocationPayload> {
  return new Promise((resolve, reject) => {
    if (!window.isSecureContext || !navigator.geolocation) {
      reject(new Error('Location capture requires HTTPS and a supported browser. You can search your address instead.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy_m: position.coords.accuracy,
        captured_at: new Date(position.timestamp).toISOString(),
      }),
      (error) => reject(new Error({
        1: 'Location permission was denied. Enable it in browser settings and retry, or search your address.',
        2: 'Your current location could not be determined. Please retry or search your address.',
        3: 'Location capture timed out. Please retry or search your address.',
      }[error.code] ?? 'Location capture failed. Please try again.')),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  });
}

export function useLocationPicker(initialValue?: SelectedLocation | null) {
  const [selected, setSelected] = useState<SelectedLocation | null>(initialValue ?? null);
  const [captured, setCaptured] = useState<CapturedLocation | null>(initialValue?.gpsCapture ?? null);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const sequence = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const normalize = useMutation({
    mutationFn: ({ data, signal }: { data: NormalizeLocationPayload; signal: AbortSignal }) =>
      locationApi.normalize(data, signal),
    retry: false, gcTime: 0,
  });
  const geocode = useMutation({
    mutationFn: ({ text, signal }: { text: string; signal: AbortSignal }) =>
      locationApi.geocode(text, signal),
    retry: false, gcTime: 0,
  });

  useEffect(() => () => {
    sequence.current++;
    controller.current?.abort();
  }, []);

  function begin() {
    controller.current?.abort();
    controller.current = new AbortController();
    setError(null);
    return { id: ++sequence.current, signal: controller.current.signal };
  }

  function report(reason: unknown) {
    setError(reason instanceof Error ? reason.message : 'Unable to get your location. Please retry.');
    if (reason instanceof LocationRequestError && reason.retryAt) setCooldownUntil(reason.retryAt);
  }

  async function capture() {
    if (busy || searching) return;
    const { id, signal } = begin();
    setBusy(true);
    setResults([]);
    setSearched(false);
    try {
      const raw = await captureDevicePosition();
      if (id !== sequence.current) return;
      // Retain new raw GPS independently, even when reverse lookup fails.
      const rawCapture: CapturedLocation = { ...raw, source: 'device_geolocation' };
      setCaptured(rawCapture);
      const location = await normalize.mutateAsync({ data: raw, signal });
      if (id !== sequence.current) return;
      setCaptured(location);
      const candidate: SelectedLocation = {
        ...location, address: location.address?.trim() ?? '', gpsCapture: location,
      };
      if (!isCompleteLocation(candidate)) {
        setSelected(null);
        throw new Error('GPS captured, but no full address was found. Search your address below.');
      }
      setSelected(candidate);
    } catch (reason) {
      if (id === sequence.current) report(reason);
    } finally {
      if (id === sequence.current) {
        setBusy(false);
        normalize.reset();
      }
    }
  }

  async function search(text: string) {
    if (busy || searching) return;
    const query = text.trim();
    if (query.length < 3 || query.length > 500) {
      setError('Enter an address between 3 and 500 characters.');
      return;
    }
    const { id, signal } = begin();
    setSearching(true);
    setSelected(null);
    setResults([]);
    setSearched(false);
    try {
      const matches = await geocode.mutateAsync({ text: query, signal });
      if (id !== sequence.current) return;
      setResults(matches.filter((match) => typeof match.address === 'string' && match.address.trim().length >= 5));
      setSearched(true);
      if (matches.length && matches.every((match) => !match.address || match.address.trim().length < 5)) {
        throw new Error('The search results did not include full addresses. Try a more detailed address.');
      }
    } catch (reason) {
      if (id === sequence.current) report(reason);
    } finally {
      if (id === sequence.current) {
        setSearching(false);
        geocode.reset();
      }
    }
  }

  function select(match: LocationResult) {
    const value: SelectedLocation = {
      ...match, address: match.address?.trim() ?? '', source: 'manual_geocode',
      ...(captured ? { gpsCapture: captured } : {}),
    };
    if (isCompleteLocation(value)) {
      setSelected(value);
      setError(null);
    }
  }

  function reset() {
    sequence.current++;
    controller.current?.abort();
    setSelected(null);
    setCaptured(null);
    setResults([]);
    setError(null);
    setBusy(false);
    setSearching(false);
    setSearched(false);
    normalize.reset();
    geocode.reset();
  }

  return { selected, captured, results, busy, searching, error, searched, cooldownUntil, capture, search, select, reset };
}
