<script setup>
import { ref, onMounted, watch } from 'vue'
import ConfettiComponent from '@/components/ConfettiComponent.vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import { useRoute, useRouter } from 'vue-router'
import { useDocument } from 'vuefire'
import { motion } from 'motion-v'

const route = useRoute()
const router = useRouter()
const runID = route.params.runID
const docRef = doc(db, 'runs', runID)
const runData = useDocument(docRef)
const exerciseType = ref('')
const newComment = ref('')
const mapRef = ref(null)
const map = ref(null)

watch(runData, async (newData) => {
  if (!newData) {
    router.push('/404')
  }
  if (newData?.path && newData.path.length > 0 && !map.value) {
    await loadGoogleMaps()
    initMap()
  }
}, { immediate: true })

const saveSessionDetails = async () => {
  await updateDoc(docRef, {
    description: newComment.value,
    exerciseType: exerciseType.value,
  })
  alert('Your session details have been saved.')
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

function goToSessionInfo() {
  router.push({ name: 'viewSession', params: { runID: runID } })
}
</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <motion.div
      class="flex flex-col items-center header m-2"
      id="congratulations-container"
      :initial="{ opacity: 0, y: -80 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
    >
      <div>
        <ConfettiComponent text="Congratulations!"></ConfettiComponent>
      </div>

      <div id="victory-animation" class="my-6">
        <img src="../assets/gifs/victory_animation.gif" class="h-75" />
      </div>
    </motion.div>

    <div
      v-if="runData?.path && runData.path.length > 0"
      id="map"
      class="border-6 border-orange-salmon rounded-xl m-4"
      ref="mapRef"
      style="height: 400px"
    ></div>

    <div id="session-information-container" class="flex flex-col items-center">
      <div class="flex flex-row justify-between">
        <div class="text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">
          {{ runData?.duration || 0 }} Minutes
        </div>

        <div class="text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">
          {{ runData?.miles || 0 }} Miles
        </div>
      </div>

      <div
        id="form-container"
        class="flex flex-col border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-4"
      >
        <div class="flex flex-row items-center">
          <label for="exercise-type">Exercise Type: </label>
          <select
            v-model="exerciseType"
            id="exercise-type"
            class="bg-orange-salmon hover:bg-light-orange-salmon rounded-xl px-4 py-2 my-2 mx-4 cursor-pointer transition-transform delay-100 ease-in-out focus:scale-110 focus:ring-2 focus:ring-off-white focus:border-off-white"
            required
          >
            <option disabled selected hidden value="">Select Option</option>
            <option value="Walk">Walk</option>
            <option value="Run">Run</option>
            <option value="Bike Ride">Bike Ride</option>
          </select>
        </div>

        <div class="flex flex-col my-2">
          <label for="comment">Comment: </label>
          <textarea
            v-model="newComment"
            placeholder="Add an optional comment about your session!"
            id="comment"
            class="border-2 border-orange-salmon rounded-xl p-2 my-2 focus:ring-2 focus:ring-off-white focus:border-off-white"
            rows="3"
          ></textarea>
        </div>

        <button
          @click="saveSessionDetails"
          class="p-2 bg-off-white active:bg-lightgray text-orange-salmon rounded-xl cursor-pointer"
        >
          <font-awesome-icon icon="fa-save" /> Save Session Details
        </button>
      </div>

      <RouterLink
        :to="{ name: 'dashboard' }"
        class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 m-4 cursor-pointer"
      >
        <font-awesome-icon icon="fa-home" /> See Your Stats
      </RouterLink>
    </div>
  </div>

  <div id="desktop-view" class="hidden mt-60 text-off-white drop-shadow-xl/50">
    <div id="mobile-phone-animation">
      <img src="../assets/gifs/phone_animation.gif" class="h-75" />
    </div>

    <motion.div
      class="flex flex-col items-center"
      :initial="{ opacity: 0, y: -80 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
    >
      <h1 class="text-3xl text-center text-orange-salmon font-bold p-4">Oops!</h1>
      <h2 class="text-2xl text-center p-4">This page can only be viewed on a mobile device.</h2>

      <div class="flex items-center">
        <motion.button
          @click="goToSessionInfo"
          class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
          :whileHover="{ scale: 1.15, rotate: 3 }"
          :whileTap="{ scale: 0.9, rotate: -5 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
        >
          <font-awesome-icon icon="fa-eye" /> View Session Info
        </motion.button>

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
    </motion.div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #mobile-view {
    display: none;
  }
  #desktop-view {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  #mobile-phone-animation {
    width: calc(var(--spacing) * 100);
  }
}
</style>
