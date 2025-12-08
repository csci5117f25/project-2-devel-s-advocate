<template>
  <div ref="mapRef" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  runs: {
    type: Array,
    default: () => []
  }
})

const mapRef = ref(null)
const map = ref(null)
const heatmap = ref(null)

function loadGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google?.maps) 
      return resolve()

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_API_KEY}&libraries=visualization`
    script.async = true
    script.onload = resolve
    document.head.appendChild(script)
  })
}

function initMap() {
  if (!mapRef.value) return

  const center = { lat: 44.9738, lng: -93.2277 }

  map.value = new window.google.maps.Map(mapRef.value, {
    zoom: 12,
    center: center,
    mapTypeId: 'terrain',
    gestureHandling: 'greedy',
    disableDefaultUI: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  })

  updateHeatmap()
}

function updateHeatmap() {
  if (!map.value || !window.google?.maps?.visualization) return

  // Clear existing heatmap
  if (heatmap.value) {
    heatmap.value.setMap(null)
  }

  // Extract all coordinates from all runs
  const coordinates = []
  props.runs.forEach(run => {
    if (run.path && Array.isArray(run.path)) {
      run.path.forEach(point => {
        if (point.lat && point.lng) {
          coordinates.push(new window.google.maps.LatLng(point.lat, point.lng))
        }
      })
    }
  })

  if (coordinates.length > 0) {
    heatmap.value = new window.google.maps.visualization.HeatmapLayer({
      data: coordinates,
      map: map.value,
      radius: 20,
      opacity: 0.6,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    })

    //Fitbounds
    const bounds = new window.google.maps.LatLngBounds()
    coordinates.forEach(coord => bounds.extend(coord))
    map.value.fitBounds(bounds)
  }
}

onMounted(async () => {
  await loadGoogleMaps()
  initMap()
})

//Changes
watch(() => props.runs, updateHeatmap, { deep: true })
</script>

<style scoped>
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}
</style>
