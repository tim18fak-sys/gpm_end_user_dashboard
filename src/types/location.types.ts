export interface LocationResult {
  address?: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  state?: string;
  city?: string;
}

export interface NormalizeLocationPayload {
  latitude: number;
  longitude: number;
  accuracy_m: number;
  captured_at: string;
}

export interface CapturedLocation extends LocationResult, NormalizeLocationPayload {
  source: 'device_geolocation';
}

/** A searched address is never represented as an authoritative GPS capture. */
export interface SelectedLocation extends LocationResult {
  address: string;
  source: 'device_geolocation' | 'manual_geocode';
  gpsCapture?: CapturedLocation;
}

export function hasValidCoordinates(value: unknown): value is LocationResult {
  if (!value || typeof value !== 'object') return false;
  const point = value as LocationResult;
  return typeof point.latitude === 'number' && Number.isFinite(point.latitude)
    && point.latitude >= -90 && point.latitude <= 90
    && typeof point.longitude === 'number' && Number.isFinite(point.longitude)
    && point.longitude >= -180 && point.longitude <= 180;
}

export function isCompleteLocation(value: unknown): value is SelectedLocation {
  return hasValidCoordinates(value)
    && typeof value.address === 'string' && value.address.trim().length >= 5
    && value.address.length <= 500
    && ('source' in value)
    && (value.source === 'device_geolocation' || value.source === 'manual_geocode');
}
