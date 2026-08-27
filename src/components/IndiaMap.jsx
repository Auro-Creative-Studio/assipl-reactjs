import { useState } from 'react'
import { Building2 } from 'lucide-react'
import indiaMapImage from '../assets/home/india-map.webp'
import mapPinImage from '../assets/home/map-pin.png'

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
  const [activeLocation, setActiveLocation] = useState(null)

  return (
    <div
      className="relative mx-auto aspect-989/1024 w-full max-w-[560px] lg:mx-0 lg:translate-x-8"
      onClick={() => setActiveLocation(null)}
    >
      <img
        src={indiaMapImage}
        alt="Map of India"
        className="absolute inset-0 h-full w-full object-contain"
      />

      {locations.map((location, index) => (
        <div
          key={location.name}
          className={`group absolute cursor-pointer ${activeLocation === location.name ? 'z-50' : 'hover:z-50'}`}
          style={project(location)}
          role="button"
          tabIndex={0}
          aria-label={location.name}
          onClick={(event) => {
            event.stopPropagation()
            setActiveLocation((current) => (current === location.name ? null : location.name))
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setActiveLocation((current) => (current === location.name ? null : location.name))
            }
          }}
        >
          <div className="imgl-marker-zoom absolute" style={{ transform: 'scale(0.566229, 0.566229)', transformOrigin: '0% 0%' }}>
            <div className="imgl-marker-offset absolute -translate-x-1/2 -translate-y-1/2">
              <div
                className="imgl-marker relative"
                style={{ width: '45.7758px', height: '54.9596px', transform: 'rotate(0deg)' }}
              >
                <div className={`imgl-pin imgl-pin-${index + 1} h-full w-full`} data-id={index + 1}>
                  <div
                    className="imgl-pin-data relative z-[2] flex h-full w-full items-center justify-center bg-center bg-no-repeat"
                    style={{ backgroundImage: location.hq ? undefined : `url(${mapPinImage})` }}
                  >
                    {location.hq && (
                      <Building2
                        className="h-[32px] w-[32px] text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span
            className={`pointer-events-none absolute bottom-[18px] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-white px-[52px] py-[10px] text-[15px] font-medium text-[#63708a] shadow-[0_7px_18px_rgba(18,28,69,0.2)] transition group-hover:opacity-100 ${
              activeLocation === location.name ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {location.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default IndiaMap
