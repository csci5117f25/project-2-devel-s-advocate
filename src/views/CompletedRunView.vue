<script setup>
import { ref, onMounted, watch } from 'vue'
import ConfettiComponent from '@/components/ConfettiComponent.vue'
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
    if (window.google?.maps)
      return resolve()

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
        stylers: [{ visibility: 'off' }]
      }
    ]
  })

  // Draw route if it exists
  console.log('Considering route on map:', runData)
  if (runData.value?.path && runData.value.path.length > 0) {
    console.log('Drawing route on map:', runData.value.path)
    const polyline = new window.google.maps.Polyline({
      path: runData.value.path,
      geodesic: true,
      strokeColor: '#FF3B30',
      strokeOpacity: 1.0,
      strokeWeight: 5,
    })
    polyline.setMap(map.value)

    // Center map on the route
    const bounds = new window.google.maps.LatLngBounds()
    runData.value.path.forEach(point => {
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
  <div id="mobile-view" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <div>
      <ConfettiComponent text="Congratulations!"></ConfettiComponent>
    </div>

    <!-- <div class="h-75 text-center border-6 border-orange-salmon rounded-xl px-4 py-2 m-4">
      Victory Animation
    </div> -->

    <div id="tired-animation">
      <img src="../assets/gifs/victory_animation.gif" class="h-75" />
    </div>

    <div class="h-75 text-center border-6 border-orange-salmon rounded-xl px-4 py-2 m-4" style="height: 400px;">
      <div id="map" ref="mapRef" style="height: 100%;"></div>
    </div>

    <div class="flex flex-row justify-between">
      <div class="w-2/5 text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">{{ runData?.duration || 0 }} minutes</div>

      <div class="w-2/5 text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">{{ runData?.miles || 0 }} miles</div>
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
          class="bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        >
          <option disabled selected hidden value="">Select Option</option>
          <option value="type-walk">Walk</option>
          <option value="type-run">Run</option>
          <option value="type-bike-ride">Bike Ride</option>
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
    </div>

    <button
      @click="addCommentToRun()"
      class="mt-2 p-2 bg-off-white text-orange-salmon rounded-xl m-4 my-8"
    >
      See Your Stats
    </button>
  </div>

  <div id="desktop-view" class="hidden mt-32 text-off-white">
    <div class="h-100 w-100 text-center border-6 border-orange-salmon rounded-xl px-4 py-2">
      Mobile Phone Animation
    </div>
    <div class="flex flex-col">
      <h1 class="text-3xl text-center text-orange-salmon font-bold m-2">Oops!</h1>

      <h2 class="text-2xl p-2 m-2">
        The stats of a new run can only be viewed on a mobile device.
      </h2>

      <RouterLink
        :to="{ name: 'splashPage' }"
        class="text-center text-orange-salmon bg-off-white rounded-xl p-2 m-4"
      >
        Return Home
      </RouterLink>
    </div>
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
    justify-content: space-around;
    align-items: center;
  }
}
</style>
