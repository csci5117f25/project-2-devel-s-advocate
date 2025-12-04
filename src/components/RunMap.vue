<template>
    <div id="map" ref="mapRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mapRef = ref(null)
const isTracking = ref(false)
const loading = ref(true)
const track = ref([]) //Raw GPS points
const simplifiedTrack = ref([]) // Simplified for display
let map = null
let polyline = null
let watchId = null
let lastUpdate = 0
const UPDATE_INTERVAL = 4000    // Update map every 4 seconds
const SIMPLIFY_TOLERANCE = 0.000015  // Tolarance for simplify-js

// Distance in meters
const distance = ref(0)

// ────────────────────────────────────────────────────────────────
// Load Google Maps + simplify-js
// ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadGoogleMaps()
  await loadSimplifyJs()
  initMap()
  loading.value = false
})

function loadGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google?.maps) return resolve()
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry`
    script.onload = resolve
    document.head.appendChild(script)
  })
}

function loadSimplifyJs() {
  return new Promise((resolve) => {
    if (window.simplify) return resolve()
    
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/simplify-js@1.2.4/simplify.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

// ────────────────────────────────────────────────────────────────
// Initialize Google Maps
// ────────────────────────────────────────────────────────────────
function initMap() {
  map = new google.maps.Map(mapRef.value, {
    zoom: 16,
    center: { lat: 37.7749, lng: -122.4194 },
    mapTypeId: 'terrain',
    disableDefaultUI: false,
    gestureHandling: 'greedy'
  })

  polyline = new google.maps.Polyline({
    geodesic: true,
    strokeColor: '#FF3B30',
    strokeOpacity: 1.0,
    strokeWeight: 5
  })
  polyline.setMap(map)
}

// ────────────────────────────────────────────────────────────────
// Start / Stop tracking
// ────────────────────────────────────────────────────────────────
function toggleTracking() {
  if (isTracking.value) {
    stopTracking()
  } else {
    startTracking()
  }
}

async function startTracking() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported')
    return
  }

  isTracking.value = true
  track.value = []
  simplifiedTrack.value = []
  distance.value = 0
  lastUpdate = 0

  watchId = navigator.geolocation.watchPosition(
    onPositionUpdate,
    (err) => console.error('GPS Error:', err),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )

  // Move map to user
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, lng: longitude } = pos.coords
    map.setCenter({ lat: latitude, lng: longitude })
    map.setZoom(18)
  })
}

function stopTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  isTracking.value = false
  updatePolyline() // final update
}

// ────────────────────────────────────────────────────────────────
// Handle new GPS point
// ────────────────────────────────────────────────────────────────
function onPositionUpdate(position) {
  const { latitude, longitude, accuracy } = position.coords

  const point = {
    lat: latitude,
    lng: longitude,
    timestamp: position.timestamp,
    accuracy
  }

  track.value.push(point)

  // Calculate distance (only if we have previous point)
  if (track.value.length > 1) {
    const prev = track.value[track.value.length - 2]
    const meters = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(prev.lat, prev.lng),
      new google.maps.LatLng(latitude, longitude)
    )
    distance.value += meters
  }

  // Throttled map update
  const now = Date.now()
  if (now - lastUpdate > UPDATE_INTERVAL) {
    updatePolyline()
    lastUpdate = now
  }
}

// ────────────────────────────────────────────────────────────────
// Simplify + update polyline
// ────────────────────────────────────────────────────────────────
function updatePolyline() {
  if (!window.simplify || track.value.length < 2) return

  const pointsForSimplify = track.value.map(p => ({ x: p.lat, y: p.lng }))
  const simplified = window.simplify(pointsForSimplify, SIMPLIFY_TOLERANCE, true)

  simplifiedTrack.value = simplified.map(p => ({ lat: p.x, lng: p.y }))
  polyline.setPath(simplifiedTrack.value)
}

function formatDistance(meters) {
  if (meters >= 1000) {
    return (meters / 1000).toFixed(2) + ' km'
  }
  return meters.toFixed(0) + ' m'
}

onUnmounted(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId)
})
</script>

<style scoped>
.runner {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

#map {
  flex: 1;
}

.controls {
  padding: 15px;
  background: white;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

button {
  padding: 12px 30px;
  font-size: 18px;
  background: #FF3B30;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.stats {
  margin-top: 10px;
  font-size: 16px;
}
</style>