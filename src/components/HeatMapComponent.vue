<template>
  <div ref="mapRef" class="w-full h-full border-6 border-orange-salmon rounded-xl my-8"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  runs: {
    type: Array,
    default: () => [],
  },
})

const mapRef = ref(null)
const map = ref(null)
const heatmap = ref(null)

function loadGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google?.maps && window.google?.maps?.visualization) {
      return resolve()
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      const checkReady = () => {
        if (window.google?.maps?.visualization) {
          resolve()
        } else {
          setTimeout(checkReady, 100)
        }
      }
      checkReady()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_API_KEY}&libraries=visualization`
    script.async = true
    script.onload = () => {
      // Wait a bit for the visualization library to be ready
      const checkVisualization = () => {
        if (window.google?.maps?.visualization) {
          resolve()
        } else {
          setTimeout(checkVisualization, 100)
        }
      }
      checkVisualization()
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script')
    }
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
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#f4f3ef' }],
      },
      {
        featureType: 'park',
        elementType: 'geometry',
        stylers: [{ color: '#f4f3ef' }],
      },
      {
        featureType: 'green',
        elementType: 'geometry',
        stylers: [{ color: '#f4f3ef' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#7d4e57' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d66853' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#364156' }],
      },
    ],
  })

  // Delay updateHeatmap to ensure visualization library is ready
  setTimeout(() => {
    updateHeatmap()
  }, 200)
}

function updateHeatmap() {
  if (!map.value) {
    return
  }

  if (!window.google?.maps?.visualization) {
    // Retry in 500ms if visualization library isn't ready yet
    setTimeout(updateHeatmap, 500)
    return
  }

  // Clear existing heatmap
  if (heatmap.value) {
    heatmap.value.setMap(null)
  }

  // Extract all coordinates from all runs
  const coordinates = []
  props.runs.forEach((run, index) => {
    if (run.path && Array.isArray(run.path)) {
      run.path.forEach((point, pointIndex) => {
        if (point && typeof point.lat === 'number' && typeof point.lng === 'number') {
          coordinates.push(new window.google.maps.LatLng(point.lat, point.lng))
        }
      })
    }
  })

  if (coordinates.length > 0) {
    heatmap.value = new window.google.maps.visualization.HeatmapLayer({
      data: coordinates,
      map: map.value,
      radius: 10,
      opacity: 0.5,
      gradient: [
        'rgba(255, 255, 255, 0)', // transparent white
        'rgba(255, 235, 59, 0.4)', // bright yellow
        'rgba(255, 193, 7, 0.6)', // golden yellow
        'rgba(255, 152, 0, 0.7)', // orange
        'rgba(255, 87, 34, 0.8)', // deep orange
        'rgba(244, 67, 54, 0.9)', // red
        'rgba(211, 47, 47, 1)', // dark red
      ],
    })

    const bounds = new window.google.maps.LatLngBounds()
    coordinates.forEach((coord) => bounds.extend(coord))
    map.value.fitBounds(bounds)
  }
}

onMounted(async () => {
  await loadGoogleMaps()
  initMap()
})

//Changes
watch(
  () => props.runs,
  (newRuns) => {
    if (newRuns && newRuns.length > 0) {
      updateHeatmap()
    }
  },
  { deep: true, immediate: false },
)
</script>

<style scoped>
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}
</style>
