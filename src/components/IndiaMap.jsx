import { Building2, MapPin } from 'lucide-react'
import indiaMapImage from '../assets/home/india-map.webp'

const LON_MIN = 68
const LON_MAX = 97.5
const LAT_MIN = 8
const LAT_MAX = 37.5

// The landmass in india-map.webp doesn't fill the image edge-to-edge -
// there's a small margin on every side. Map lon/lat into that actual
// content box instead of the full 0-100% container so markers land on
// the right spot instead of drifting inward from the coastline.
const MAP_LEFT = 1.5
const MAP_RIGHT = 98.5
const MAP_TOP = 4
const MAP_BOTTOM = 91

function project({ lon, lat }) {
  return {
    left: `${((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (MAP_RIGHT - MAP_LEFT) + MAP_LEFT}%`,
    top: `${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (MAP_BOTTOM - MAP_TOP) + MAP_TOP}%`,
  }
}

function IndiaMap({ locations }) {
  return (
    <div className="relative mx-auto aspect-989/1024 w-full max-w-md">
      <img
        src={indiaMapImage}
        alt="Map of India"
        className="absolute inset-0 h-full w-full object-contain"
      />

      {locations.map((location) => (
        <div
          key={location.name}
          className="group absolute -translate-x-1/2 -translate-y-full hover:z-50"
          style={project(location)}
        >
          {location.hq ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white shadow-lg ring-2 ring-white/80">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : (
            <MapPin className="h-5 w-5 fill-white text-secondary drop-shadow" aria-hidden="true" />
          )}
          <span
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-secondary opacity-0 shadow-lg transition group-hover:opacity-100"
          >
            {location.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default IndiaMap
