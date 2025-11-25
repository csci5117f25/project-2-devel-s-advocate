<template>
  <GoogleMap
    :api-key="apiKey"
    class="w-full h-full rounded-lg shadow-lg"
    :center="center"
    :zoom="zoom"
    :options="mapOptions"
    @ready="onMapReady"
  >
    <Marker
      v-if="userLocation"
      :options="{
        position: userLocation,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.5,
          anchor: { x: 12, y: 22 }
        }
      }"
    />
    <Polyline
      v-if="decodedPath.length > 0"
      :options="{
        path: decodedPath,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 1,
        strokeWeight: 6
      }"
    />
  </GoogleMap>
</template>

<script setup>
/* global google */
import { ref, computed, watch } from 'vue'
import { GoogleMap, Polyline, Marker } from 'vue3-google-map'
import { decode } from '@googlemaps/polyline-codec'

const props = defineProps({
  polyline: { type: String, default: '' }
})

const userLocation = ref(null)

const apiKey = import.meta.env.VITE_MAPS_API_KEY
const center = ref({ lat: 40, lng: -100 })
const zoom = ref(4)
const mapInstance = ref(null)

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  clickableIcons: false,
  gestureHandling: 'greedy',
  keyboardShortcuts: false,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    }
  ]
}

const decodedPath = computed(() => {
  if (!props.polyline) return []
  const decoded = decode(props.polyline)
  return decoded.map(([lat, lng]) => ({ lat, lng }))
})

function onMapReady(map) {
  mapInstance.value = map
  getUserLocation()
  fitBounds()
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        userLocation.value = location
        center.value = location
        zoom.value = 15
        if (mapInstance.value && !props.polyline) {
          mapInstance.value.panTo(location)
          mapInstance.value.setZoom(15)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }
}

function fitBounds() {
  if (!mapInstance.value || decodedPath.value.length === 0) return
  
  const bounds = new google.maps.LatLngBounds()
  decodedPath.value.forEach(point => bounds.extend(point))
  mapInstance.value.fitBounds(bounds)
}

watch(decodedPath, () => {
  if (mapInstance.value) fitBounds()
})
</script>

<style>
.h-full { height: 400px; }

/* Force hide all Google Maps controls */
.gm-style .gmnoprint,
.gm-style .gm-style-cc,
.gm-bundled-control,
.gm-fullscreen-control,
.gmnoprint {
  display: none !important;
}
</style>