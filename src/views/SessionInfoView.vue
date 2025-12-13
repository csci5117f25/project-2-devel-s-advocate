<script setup>
import { ref, onMounted, watch } from 'vue'
// import ConfettiComponent from '@/components/ConfettiComponent.vue'
import EditComponent from '../components/EditComponent.vue'
import { collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import { useRoute, useRouter } from 'vue-router'
import { useDocument } from 'vuefire'

const route = useRoute()
const router = useRouter()
const runID = route.params.runID
const docRef = doc(db, 'runs', runID)
const runData = useDocument(docRef)
const exerciseType = ref('')
const newComment = ref('')
const mapRef = ref(null)
const map = ref(null)

// TODO: Melody: Update this so that the type of the run and optional comment
// is added.
const addCommentToRun = async () => {
  await updateDoc(docRef, {
    description: newComment.value,
    exerciseType: exerciseType.value,
  })

  newComment.value = ''
  router.push('/dashboard')
}

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
        stylers: [{ color: '#212d40' }], 
      },
      {
        featureType: 'park',
        elementType: 'geometry',
        stylers: [{ color: '#212d40' }], 
      },
      {
        featureType: 'green',
        elementType: 'geometry',
        stylers: [{ color: '#212d40' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#4a5d7a' }], 
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#4a5d7a' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#11151c' }], 
      },
    ],
  })

  // Draw route if it exists
  console.log('Considering route on map:', runData)
  if (runData.value?.path && runData.value.path.length > 0) {
    console.log('Drawing route on map:', runData.value.path)
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

onMounted(async () => {
  await loadGoogleMaps()
  initMap()
})
</script>

<template>
  <!-- <div id="mobile-view" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50"> -->
  <div id="completed-run-container" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <div class="flex flex-col items-center">
      <h1 class="text-center text-3xl text-orange-salmon font-bold">Session Information</h1>

      <h2 class="text-center">ID: {{ runID }}</h2>
    </div>

    <div id="map-and-info-container" class="flex flex-col items-center m-2">
      <div
        id="map"
        class="border-6 border-orange-salmon rounded-xl m-4 w-11/12"
        ref="mapRef"
        style="height: 400px"
      ></div>

      <div
        id="session-information-container"
        class="flex flex-col border-6 border-orange-salmon rounded-xl px-4 pt-4 pb-1 w-11/12 m-2"
      >
        <EditComponent
          :runID="runID"
          :view="sessionInfo"
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

    <RouterLink
      :to="{ name: 'dashboard' }"
      class="text-center text-orange-salmon bg-off-white hover:bg-lightgray rounded-xl px-4 py-2 m-4 cursor-pointer"
    >
      <font-awesome-icon icon="fa-home" /> See Your Stats
    </RouterLink>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #completed-run-container {
    justify-content: space-around;
    align-items: center;
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
