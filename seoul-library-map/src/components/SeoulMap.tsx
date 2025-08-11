import { useEffect } from 'react'
import L, { GeoJSON, Path } from 'leaflet'

export type DistrictFeatureProperties = {
  name_2?: string // district name from source data
  name?: string
}

export type LibraryPoint = {
  id: string
  name: string
  district: string
  lat: number
  lng: number
}

export type SeoulMapProps = {
  containerId: string
  onLibrarySelect?: (libId: string) => void
}

export function SeoulMap({ containerId, onLibrarySelect }: SeoulMapProps) {
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const map = L.map(containerId, {
      center: [37.5665, 126.9780],
      zoom: 11,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    })
    base.addTo(map)

    let districtLayer: GeoJSON<any> | null = null

    fetch('/data/seoul_municipalities_geo_simple.json')
      .then((r) => r.json())
      .then((geo) => {
        districtLayer = L.geoJSON(geo as any, {
          style: () => ({
            color: '#111827',
            weight: 1,
            fillColor: '#93c5fd',
            fillOpacity: 0.15,
          }),
          onEachFeature: (feature, layer) => {
            const props = feature.properties as DistrictFeatureProperties
            const name = (props?.name_2 || props?.name || '').trim()
            layer.bindTooltip(name, { sticky: true })
            layer.on('mouseover', () => {
              ;(layer as Path).setStyle({ fillOpacity: 0.3 })
            })
            layer.on('mouseout', () => {
              ;(layer as Path).setStyle({ fillOpacity: 0.15 })
            })
          },
        })
        districtLayer.addTo(map)
        map.fitBounds(districtLayer.getBounds(), { padding: [16, 16] })
      })
      .catch(console.error)

    fetch('/data/libraries.sample.json')
      .then((r) => r.json())
      .then((libs: LibraryPoint[]) => {
        libs.forEach((lib) => {
          const marker = L.circleMarker([lib.lat, lib.lng], {
            radius: 6,
            color: '#2563eb',
            weight: 1,
            fillColor: '#3b82f6',
            fillOpacity: 0.85,
          })
          marker.bindPopup(`<strong>${lib.name}</strong><br/>${lib.district}`)
          marker.on('click', () => onLibrarySelect?.(lib.id))
          marker.addTo(map)
        })
      })
      .catch(console.error)

    return () => {
      map.remove()
    }
  }, [containerId, onLibrarySelect])

  return null
}

export default SeoulMap