<script setup>
import { ref, onMounted, watch } from 'vue'
import EditComponent from '../components/EditComponent.vue'
import { doc } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import { useRoute, useRouter } from 'vue-router'
import { useDocument } from 'vuefire'
import { motion } from 'motion-v'

const route = useRoute()
const router = useRouter()
const runID = route.params.runID
const docRef = doc(db, 'runs', runID)
const { data: runData, pending } = useDocument(docRef)
const mapRef = ref(null)
const map = ref(null)

watch(
  [runData, pending],
  async ([newData, isPending]) => {
    if (isPending) return

    if (!newData) {
      router.push('/404')
      return
    }

    if (newData?.path && newData.path.length > 0 && !map.value) {
      await loadGoogleMaps()
      initMap()
    }
  },
  { immediate: true },
)

function loadGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google?.maps) return resolve()

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAPS_API_KEY}&libraries=geometry`
    script.async = true
    script.onload = resolve
    document.head.appendChild(script)
  })
}

function initMap() {
  if (!mapRef.value) return

  // Default center, will be overridden if path exists
  const center = { lat: 44.9738, lng: -93.2277 }

  map.value = new window.google.maps.Map(mapRef.value, {
    zoom: 16,
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

  // Draw route if it exists
  // console.log('Considering route on map:', runData)
  if (runData.value?.path && runData.value.path.length > 0) {
    // console.log('Drawing route on map:', runData.value.path)
    const polyline = new window.google.maps.Polyline({
      path: runData.value.path,
      geodesic: true,
      strokeColor: '#d66853', // orange-salmon theme color
      strokeOpacity: 1.0,
      strokeWeight: 5,
    })
    polyline.setMap(map.value)

    // Center map on the route
    const bounds = new window.google.maps.LatLngBounds()
    runData.value.path.forEach((point) => {
      bounds.extend(point)
    })
    map.value.fitBounds(bounds)
  }
}

function goToDashboard() {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div id="session-info-container" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <motion.div
      class="flex flex-col items-center"
      :initial="{ opacity: 0, y: -80 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
    >
      <h1 class="text-center text-3xl text-orange-salmon font-bold">Session Details</h1>

      <h2 class="text-center">ID: {{ runID }}</h2>
    </motion.div>

    <div id="map-and-info-container" class="flex flex-col items-center m-2">
      <div
        v-if="runData?.path && runData.path.length > 0"
        id="map"
        class="border-6 border-orange-salmon rounded-xl m-4 w-11/12"
        ref="mapRef"
        style="height: 400px"
      ></div>
      <div v-else>
        <img
          v-if="runData.exerciseType == 'Walk'"
          src="../assets/gifs/walking_animation.gif"
          class="h-40 m-4"
        />
        <img
          v-else-if="runData.exerciseType == 'Run'"
          src="../assets/gifs/running_animation.gif"
          class="h-40 m-4"
        />
        <img
          v-else-if="runData.exerciseType == 'Bike Ride'"
          src="../assets/gifs/biking_animation.gif"
          class="h-40 m-4"
        />
        <img v-else src="../assets/gifs/victory_animation.gif" class="h-40 m-4" />
      </div>

      <div
        v-if="runData"
        id="session-info-container"
        class="flex flex-col border-6 border-orange-salmon rounded-xl px-4 pt-4 pb-1 w-11/12 m-2"
      >
        <EditComponent
          :runID="runID"
          :view="'sessionInfo'"
          :description="runData.description"
          :distance="runData.distance"
          :duration="runData.duration"
          :startTime="runData.startTime"
          :endTime="runData.endTime"
          :exerciseType="runData.exerciseType"
          :createdAt="runData.createdAt"
          :hasPath="runData.path && runData.path.length > 0"
        />
      </div>
    </div>

    <motion.button
      @click="goToDashboard"
      class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
      :whileHover="{ scale: 1.15, rotate: 3 }"
      :whileTap="{ scale: 0.9, rotate: -5 }"
      :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
    >
      <font-awesome-icon icon="fa-home" /> See Your Stats
    </motion.button>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #session-info-container {
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
  #map-and-info-container {
    justify-content: space-around;
  }
  #map {
    width: 900px;
    min-height: 500px;
  }
}
</style>
