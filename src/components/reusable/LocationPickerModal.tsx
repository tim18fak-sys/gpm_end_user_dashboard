import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowPathIcon,
  CheckIcon,
  CursorArrowRaysIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  SignalIcon,
} from '@heroicons/react/24/outline'
import type { CapturedLocation, LocationResult, SelectedLocation } from '@/types/location.types'
import { isCompleteLocation } from '@/types/location.types'
import { useLocationPicker } from '@/hooks/useLocationPicker'
import UniversalError from './UniversalError'
import UniversalLoadingSkeleton from './UniversalLoadingSkeleton'
import UniversalModal from './UniversalModal'
import UniversalSearchFilter from './UniversalSearchFilter'

export interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: SelectedLocation) => void
  value?: SelectedLocation | null
}

interface SearchFilters {
  search: string
}

function hasCompleteLocation(location: SelectedLocation | null): location is SelectedLocation {
  return isCompleteLocation(location)
}

function formatCoordinate(value: number) {
  return value.toFixed(6)
}

function accuracyLabel(capture: CapturedLocation) {
  return `${Math.round(capture.accuracy_m)} m accuracy`
}

function LocationPickerSession({
  onClose,
  onConfirm,
  value,
}: Omit<LocationPickerModalProps, 'isOpen'>) {
  const {
    selected,
    captured,
    results,
    busy,
    searching,
    error,
    searched,
    cooldownUntil,
    capture,
    search,
    select,
  } = useLocationPicker(value)
  const [query, setQuery] = useState('')
  const [queryDirty, setQueryDirty] = useState(false)
  const [retryMode, setRetryMode] = useState<'capture' | 'search' | null>(null)
  const [clock, setClock] = useState(Date.now())
  const draftRef = useRef('')
  const lastSearchRef = useRef('')

  useEffect(() => {
    if (!cooldownUntil) return
    const interval = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [cooldownUntil])

  const cooldownTime = useMemo(() => {
    if (!cooldownUntil) return 0
    const timestamp = cooldownUntil < 1_000_000_000_000 ? cooldownUntil * 1000 : cooldownUntil
    return Math.max(0, timestamp - clock)
  }, [cooldownUntil, clock])

  const queryIsValid = query.trim().length >= 3 && query.trim().length <= 500
  const canConfirm = hasCompleteLocation(selected) && !queryDirty
  const isBusy = busy || searching

  const handleInput = (text: string) => {
    draftRef.current = text
    setQuery(text)
    setQueryDirty(text.trim() !== lastSearchRef.current)
  }

  const handleSearchFilterChange = ({ search: searchText }: SearchFilters) => {
    setQuery(searchText)
    draftRef.current = searchText
    setQueryDirty(searchText.trim() !== lastSearchRef.current)
  }

  const handleSearch = async () => {
    const normalized = (draftRef.current || query).trim()
    if (normalized.length < 3 || normalized.length > 500 || cooldownTime > 0) return
    lastSearchRef.current = normalized
    setQueryDirty(false)
    setRetryMode('search')
    await search(normalized)
  }

  const handleCapture = async () => {
    if (cooldownTime > 0) return
    setQueryDirty(false)
    setRetryMode('capture')
    await capture()
  }

  const handleSelect = (result: LocationResult) => {
    select(result)
    setQueryDirty(false)
  }

  const handleConfirm = () => {
    if (canConfirm && selected) onConfirm(selected)
  }

  const handleRetry = () => {
    if (retryMode === 'capture') {
      void handleCapture()
      return
    }
    if (retryMode === 'search') void handleSearch()
  }

  const retryLabel = retryMode === 'capture' ? 'Retry location capture' : 'Retry address search'
  const selectionIsManual = selected?.source === 'manual_geocode'
  const gpsRecord = selected?.gpsCapture ?? captured

  return (
    <>
      <div className="border-b border-secondary-200 bg-white px-5 py-5 pr-14 dark:border-secondary-700 dark:bg-secondary-800 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <MapPinIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">Home address</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-secondary-900 dark:text-white">Pin the right place</h2>
            <p className="mt-1 text-sm leading-5 text-secondary-600 dark:text-secondary-400">
              Capture where you are, or search for an address to correct the pin.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
        {error && (
          <UniversalError
            compact
            title="We couldn’t update this location"
            message={error}
            onRetry={retryMode && cooldownTime === 0 ? handleRetry : undefined}
            retryLabel={retryLabel}
            className="rounded-xl"
          />
        )}

        <section aria-labelledby="capture-location-heading" className="rounded-2xl border border-primary-200 bg-primary-50/70 p-4 dark:border-primary-900 dark:bg-primary-950/40 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-lg bg-white p-2 text-primary-700 shadow-sm dark:bg-secondary-800 dark:text-primary-300">
                <CursorArrowRaysIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="capture-location-heading" className="text-sm font-semibold text-secondary-900 dark:text-white">
                  {captured || selected?.source === 'device_geolocation' ? 'Device location captured' : 'Start with your current location'}
                </h3>
                <p className="mt-1 max-w-md text-sm leading-5 text-secondary-600 dark:text-secondary-400">
                  Your browser will ask for permission only after you choose this option. You can still search manually if permission is unavailable.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleCapture()}
              disabled={isBusy || cooldownTime > 0}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-secondary-900"
            >
              {busy ? <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CursorArrowRaysIcon className="h-4 w-4" aria-hidden="true" />}
              {busy ? 'Finding your location…' : cooldownTime > 0 ? `Try again in ${Math.ceil(cooldownTime / 1000)}s` : captured ? 'Capture again' : 'Capture my location'}
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            {busy ? 'Capturing current location.' : captured ? 'Device location is available.' : ''}
          </p>
        </section>

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-secondary-200 dark:bg-secondary-700" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary-400 dark:text-secondary-500">Or search manually</span>
          <span className="h-px flex-1 bg-secondary-200 dark:bg-secondary-700" />
        </div>

        <section aria-label="Search for an address" className="space-y-3">
          <div>
            <UniversalSearchFilter<SearchFilters>
              onSearch={handleSearchFilterChange}
              onSearchInputChange={handleInput}
              debounceMs={350}
              searchPlaceholder="Street, area, landmark or town"
            />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-secondary-500 dark:text-secondary-400">
              Enter 3–500 characters. Search runs only when you press the button.
            </p>
            <button
              type="button"
              onClick={() => void handleSearch()}
              disabled={!queryIsValid || isBusy || cooldownTime > 0}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm font-semibold text-secondary-800 transition hover:border-primary-400 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:border-primary-500 dark:hover:text-primary-300"
            >
              {searching ? <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />}
              {searching ? 'Searching…' : 'Search address'}
            </button>
          </div>
        </section>

        {searching && (
          <div aria-label="Loading address matches">
            <UniversalLoadingSkeleton variant="list" rows={2} showAvatar={false} />
          </div>
        )}

        {!searching && searched && results.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-secondary-300 bg-white/70 px-4 py-5 text-center dark:border-secondary-700 dark:bg-secondary-800/50">
            <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200">No matching addresses</p>
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">Try a nearby landmark, a shorter street name or your town.</p>
          </div>
        )}

        {!searching && results.length > 0 && !queryDirty && (
          <section aria-labelledby="matching-addresses-heading" className="space-y-2">
            <h3 id="matching-addresses-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-500 dark:text-secondary-400">
              Matching addresses
            </h3>
            <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
              {results.map((result, index) => {
                const isSelected = selected?.source === 'manual_geocode' && selected.latitude === result.latitude && selected.longitude === result.longitude && selected.address === result.address
                return (
                  <li key={`${result.latitude}:${result.longitude}:${result.address ?? index}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(result)}
                      aria-pressed={isSelected}
                      className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/40'
                          : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-700 dark:hover:bg-secondary-900'
                      }`}
                    >
                      <MapPinIcon className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-secondary-400'}`} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-5 text-secondary-900 dark:text-secondary-100">{result.address || 'Address not provided'}</span>
                        <span className="mt-1 block font-mono text-[11px] tabular-nums text-secondary-500 dark:text-secondary-400">
                          {formatCoordinate(result.latitude)}, {formatCoordinate(result.longitude)}
                        </span>
                      </span>
                      {isSelected && <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-700 dark:text-primary-300" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {selected && (
          <section aria-labelledby="selected-location-heading" className="animate-fade-in rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm dark:border-secondary-700 dark:bg-secondary-800 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-success-50 p-2 text-success-700 dark:bg-success-900/30 dark:text-success-300">
                  {selectionIsManual ? <MapPinIcon className="h-5 w-5" aria-hidden="true" /> : <SignalIcon className="h-5 w-5" aria-hidden="true" />}
                </span>
                <div>
                  <h3 id="selected-location-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-secondary-500 dark:text-secondary-400">
                    {selectionIsManual ? 'Address selected' : 'Captured location'}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold leading-5 text-secondary-900 dark:text-white">{selected.address || 'Address is not yet available'}</p>
                  <p className="mt-1 font-mono text-xs tabular-nums text-secondary-500 dark:text-secondary-400">
                    {formatCoordinate(selected.latitude)}, {formatCoordinate(selected.longitude)}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${selectionIsManual ? 'bg-accent-50 text-accent-800 dark:bg-accent-900/30 dark:text-accent-200' : 'bg-primary-50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'}`}>
                {selectionIsManual ? 'Manual pin' : 'GPS'}
              </span>
            </div>
            {selectionIsManual && gpsRecord && (
              <div className="mt-4 flex items-start gap-2 border-t border-secondary-100 pt-3 text-xs leading-5 text-secondary-600 dark:border-secondary-700 dark:text-secondary-400">
                <SignalIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                <p>
                  GPS capture retained separately: {formatCoordinate(gpsRecord.latitude)}, {formatCoordinate(gpsRecord.longitude)} · {accuracyLabel(gpsRecord)}.
                </p>
              </div>
            )}
            {!selectionIsManual && gpsRecord && (
              <p className="mt-4 border-t border-secondary-100 pt-3 text-xs text-secondary-600 dark:border-secondary-700 dark:text-secondary-400">
                GPS accuracy: <span className="font-semibold text-secondary-800 dark:text-secondary-200">{accuracyLabel(gpsRecord)}</span>
              </p>
            )}
          </section>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-secondary-200 pt-4 dark:border-secondary-700 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-700 transition hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || isBusy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-secondary-900"
          >
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            Use this location
          </button>
        </div>
      </div>
    </>
  )
}

export default function LocationPickerModal(props: LocationPickerModalProps) {
  return (
    <UniversalModal isOpen={props.isOpen} onClose={props.onClose} ariaLabel="Choose home address">
      {props.isOpen ? (
        <LocationPickerSession
          key="location-picker-open-session"
          onClose={props.onClose}
          onConfirm={props.onConfirm}
          value={props.value}
        />
      ) : null}
    </UniversalModal>
  )
}
