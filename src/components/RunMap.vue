<template>
  <div class="relative w-full h-full">
    <div v-if="!apiKey" class="p-4 bg-red-100 text-red-700">
      Google Maps API key is missing!
    </div>
    <div v-else ref="mapContainer" class="w-full h-full rounded-lg shadow-lg border-2 border-red-500"></div>

    <!-- Loading overlay -->
    <div v-if="isLoadingLocation" class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p class="text-sm text-gray-600">Getting your location...</p>
      </div>
    </div>

    <!-- Error overlay -->
    <div v-if="locationError && !userLocation" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
      <div class="text-center p-4">
        <div class="text-red-500 mb-2">📍</div>
        <p class="text-sm text-gray-700 mb-4">{{ locationError }}</p>
        <div class="space-x-2">
          <button @click="getUserLocation" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            Try Again
          </button>
          <button @click="location.reload()" class="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global google */
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { decode } from '@googlemaps/polyline-codec'

const props = defineProps({
  polyline: { type: String, default: '' }
})

const userLocation = ref(null)
const isLoadingLocation = ref(true)
const locationError = ref(null)

const apiKey = import.meta.env.VITE_MAPS_API_KEY
const center = ref({ lat: 40, lng: -100 })
const zoom = ref(4)
const mapInstance = ref(null)
const mapContainer = ref(null)
const userLocationMarker = ref(null)
const routePolyline = ref(null)

const decodedPath = computed(() => {
  if (!props.polyline) return []
  const decoded = decode(props.polyline)
  return decoded.map(([lat, lng]) => ({ lat, lng }))
})

onMounted(async () => {
  if (!apiKey) {
    locationError.value = 'Google Maps API key is missing'
    isLoadingLocation.value = false
    return
  }

  try {
    if (typeof google === 'undefined') {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`
        script.async = true
        script.defer = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    await nextTick()
    
    if (mapContainer.value) {
      initializeMap()
    } else {
      locationError.value = 'Map container not found'
      isLoadingLocation.value = false
    }
  } catch {
    locationError.value = 'Failed to load Google Maps'
    isLoadingLocation.value = false
  }
})

function initializeMap() {
  const mapOptions = {
    center: center.value,
    zoom: zoom.value,
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

  mapInstance.value = new google.maps.Map(mapContainer.value, mapOptions)
  getUserLocation()
  updateMapElements()
}

function getUserLocation() {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported'
    isLoadingLocation.value = false
    return
  }

  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    locationError.value = 'Location services require HTTPS'
    isLoadingLocation.value = false
    return
  }

  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        locationError.value = 'Location permission denied'
        isLoadingLocation.value = false
        return
      }
      requestLocation()
    }).catch(() => {
      requestLocation()
    })
  } else {
    requestLocation()
  }
}

function requestLocation() {
  if (userLocation.value) {
    isLoadingLocation.value = false
    return
  }

  isLoadingLocation.value = true
  locationError.value = null

  // Get current position once
  // Then do continuous tracking
  navigator.geolocation.getCurrentPosition(
    (position) => {
      handleLocationSuccess(position)
      startContinuousTracking()
    },
    () => {
      startContinuousTracking()
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  )
}

function startContinuousTracking() {
  const locationTimeout = setTimeout(() => {
    if (isLoadingLocation.value) {
      locationError.value = 'Location tracking timed out'
      isLoadingLocation.value = false
    }
  }, 30000)

  navigator.geolocation.watchPosition(
    (position) => {
      clearTimeout(locationTimeout)
      handleLocationSuccess(position)
    },
    () => {
      clearTimeout(locationTimeout)
      if (isLoadingLocation.value) {
        isLoadingLocation.value = false
        locationError.value = 'Unable to track location'
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 30000
    }
  )
}

function handleLocationSuccess(position) {
  console.log('Location obtained:', position)
  const location = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  }
  userLocation.value = location
  center.value = location
  zoom.value = 18
  isLoadingLocation.value = false
  updateMapElements()
}

function updateMapElements() {
  if (!mapInstance.value) return

  // Update map center and zoom
  mapInstance.value.setCenter(center.value)
  mapInstance.value.setZoom(zoom.value)

  // Update user location marker
  if (userLocation.value) {
    if (userLocationMarker.value) {
      userLocationMarker.value.setPosition(userLocation.value)
    } else {
      userLocationMarker.value = new google.maps.Marker({
        position: userLocation.value,
        map: mapInstance.value,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.5,
          anchor: new google.maps.Point(12, 22)
        }
      })
    }
  }

  // Update route polyline
  if (decodedPath.value.length > 0) {
    if (routePolyline.value) {
      routePolyline.value.setPath(decodedPath.value)
    } else {
      routePolyline.value = new google.maps.Polyline({
        path: decodedPath.value,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 1,
        strokeWeight: 6,
        map: mapInstance.value
      })
    }
    fitBounds()
  }
}

function fitBounds() {
  if (!mapInstance.value || decodedPath.value.length === 0) return
  
  //include route in bounds
  const bounds = new google.maps.LatLngBounds()
  decodedPath.value.forEach(point => bounds.extend(point))
  
  //include user location
  if (userLocation.value) {
    bounds.extend(userLocation.value)
  }
  
  mapInstance.value.fitBounds(bounds)
}

watch(decodedPath, () => {
  if (mapInstance.value) updateMapElements()
})
</script>

<style>
.h-full { height: 400px; }
.gm-style .gmnoprint,
.gm-style .gm-style-cc,
.gm-bundled-control,
.gm-fullscreen-control,
.gmnoprint {
  display: none !important;
}

/* Loading spinner animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>