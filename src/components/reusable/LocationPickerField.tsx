import { useState } from 'react'
import { MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import type { SelectedLocation } from '@/types/location.types'
import LocationPickerModal from './LocationPickerModal'

export interface LocationPickerFieldProps {
  value: SelectedLocation | null
  onChange: (value: SelectedLocation) => void
  error?: string
}

function coordinate(value: number) {
  return value.toFixed(6)
}

export default function LocationPickerField({ value, onChange, error }: LocationPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasAddress = Boolean(value?.address?.trim())

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-semibold uppercase tracking-wide text-secondary-600 dark:text-secondary-400">
          Home address
        </label>
        {hasAddress && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
            <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Location set
          </span>
        )}
      </div>

      {value && hasAddress ? (
        <div className={`rounded-xl border bg-white p-3.5 shadow-sm transition-colors dark:bg-secondary-800 ${error ? 'border-danger-400 dark:border-danger-500' : 'border-secondary-300 dark:border-secondary-600'}`}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-primary-50 p-2 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-medium leading-5 text-secondary-900 dark:text-secondary-100">{value.address}</p>
              <p className="mt-1 font-mono text-[11px] tabular-nums text-secondary-500 dark:text-secondary-400">
                {coordinate(value.latitude)}, {coordinate(value.longitude)}
              </p>
              <p className="mt-1 text-[11px] font-medium text-secondary-500 dark:text-secondary-400">
                {value.source === 'manual_geocode' ? 'Address pin' : 'Device GPS'}
                {value.source === 'device_geolocation' && value.gpsCapture ? ` · ${Math.round(value.gpsCapture.accuracy_m)} m accuracy` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Change home address"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:text-primary-300 dark:hover:bg-primary-900/30"
            >
              <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
              <span>Change location</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Add home address"
          className={`group flex min-h-[4.5rem] w-full items-center gap-3 rounded-xl border border-dashed bg-white px-4 py-3 text-left shadow-sm transition duration-150 hover:border-primary-400 hover:bg-primary-50/40 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:bg-secondary-800 dark:hover:border-primary-600 dark:hover:bg-primary-950/20 ${
            error ? 'border-danger-400 dark:border-danger-500' : 'border-secondary-300 dark:border-secondary-600'
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-transform duration-150 group-hover:scale-105 dark:bg-primary-900/30 dark:text-primary-300">
            <MapPinIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-secondary-800 dark:text-secondary-100">Add your home location</span>
            <span className="mt-0.5 block text-xs text-secondary-500 dark:text-secondary-400">Capture GPS or find it by address</span>
          </span>
          <span className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-primary-700">
            Add location
          </span>
        </button>
      )}

      {error && <p role="alert" className="text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>}

      <LocationPickerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onConfirm={(nextLocation) => {
          onChange(nextLocation)
          setIsOpen(false)
        }}
      />
    </div>
  )
}
