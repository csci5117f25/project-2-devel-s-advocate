<template>
  <div ref="mapEl" class="w-full h-full rounded-lg shadow-lg"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  polyline: { type: String, default: '' }
})

const mapEl = ref(null)
let map = null
let currentPath = null

onMounted(async () => {
  // Use the new functional API
  const { setOptions, importLibrary } = await import('@googlemaps/js-api-loader')
  
  setOptions({
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
    version: "weekly",
  })

  // Load the maps and geometry libraries
  const { Map } = await importLibrary("maps")
  await importLibrary("geometry")
  
  map = new Map(mapEl.value, {
    center: { lat: 40, lng: -100 },
    zoom: 4
  })

  // Draw immediately if polyline exists
  watch(() => props.polyline, drawPolyline, { immediate: true })
})

function drawPolyline(encodedPolyline) {
  if (!map || !encodedPolyline) return

  // Remove old path
  if (currentPath) currentPath.setMap(null)

  const path = google.maps.geometry.encoding.decodePath(encodedPolyline)

  currentPath = new google.maps.Polyline({
    path,
    geodesic: true,
    strokeColor: "#3B82F6",
    strokeOpacity: 1,
    strokeWeight: 6
  })

  currentPath.setMap(map)

  // Zoom to fit route
  const bounds = new google.maps.LatLngBounds()
  path.forEach(point => bounds.extend(point))
  map.fitBounds(bounds)
}
</script>

<style scoped>
.h-full { height: 400px; }
</style>