<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRunTracking } from '../assets/js/runTracking.js'
import { useRunStore } from '../assets/js/runStore.js'
import { saveRun } from '../assets/js/dbHelper.js'
import { useCurrentUser } from 'vuefire'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'

const mapRef = ref(null)
const map = ref(null)
const loading = ref(true)
const currentTime = ref(0)
const timerInterval = ref(null)

const store = useRunStore()
const { startTracking, stopTracking, centerMapOnUser } = useRunTracking(map)

const router = useRouter()
const user = useCurrentUser()

const tracking = computed(() => store.isTracking)
const distance = computed(() => store.distance)

const formattedTime = computed(() => {
  const totalSeconds = currentTime.value
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
})

const toggle = () => (tracking.value ? finishAndSave() : startRun())

const startRun = () => {
  startTimer()
  startTracking()
}

const startTimer = () => {
  currentTime.value = 0
  timerInterval.value = setInterval(() => {
    currentTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const finishAndSave = async () => {
  stopTimer()
  stopTracking()

  if (!user.value) {
    alert('You must be logged in to save runs! How did you get here?')
    return
  }

  const endTime = new Date()
  const startTime = new Date(store.startTime)
  const durationMinutes = Math.round((endTime - startTime) / 60000)
  const miles = store.distance * 0.000621371 // Convert meters to miles

  try {
    const runId = await saveRun({
      startTime: startTime,
      endTime: endTime,
      duration: durationMinutes,
      miles: Number(miles.toFixed(2)),
      description: '',
      path: store.track,
      userID: user.value.uid,
    })

    store.reset()
    router.push({ name: 'completedSession', params: { runID: runId } })
  } catch (error) {
    console.error('Error saving run:', error)
    alert('Failed to save your session. Please try again.')
  }
}

function formatDistance(meters) {
  //convert to miles
  const miles = meters * 0.000621371
  return miles.toFixed(2) + ' mi'
}

function cancel() {
  stopTimer()
  store.reset()
  stopTracking()
  router.push({ name: 'dashboard' })
}

onMounted(async () => {
  await loadGoogleMaps()
  const position = await centerMapOnUser()
  initMap(position)
  loading.value = false
})

//Cleanup if user navigates away
onUnmounted(() => {
  stopTimer()
})

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

function initMap(position = null) {
  const center = position
    ? { lat: position.coords.latitude, lng: position.coords.longitude }
    : { lat: 44.9738, lng: -93.2277 } // University of Minnesota
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

  const polyline = new window.google.maps.Polyline({
    geodesic: true,
    strokeColor: '#d66853', // orange-salmon theme color
    strokeOpacity: 1.0,
    strokeWeight: 5,
    map: map.value,
  })

  store.setPolyline(polyline)
}

function goToAddSession() {
  router.push({ name: 'addSession' })
}

function goToDashboard() {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <motion.div
      class="flex flex-col items-center header m-2"
      :initial="{ opacity: 0, y: -80 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
    >
      <h1 class="text-3xl text-center text-orange-salmon font-bold">Track Exercise Session</h1>
    </motion.div>

    <div
      id="map"
      class="border-6 border-orange-salmon rounded-xl mx-4 my-8"
      ref="mapRef"
      style="height: 400px"
    ></div>

    <div class="flex flex-row justify-between">
      <div class="w-2/5 text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">
        {{ formattedTime }}
      </div>

      <div class="w-2/5 text-center bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2">
        {{ formatDistance(distance) }}
      </div>
    </div>

    <div class="flex flex-row justify-between">
      <div
        @click="toggle"
        class="w-2/5 text-center bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
      >
        {{ tracking ? 'Stop' : 'Start' }}
      </div>

      <div
        @click="cancel"
        class="w-2/5 text-center bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
      >
        Cancel
      </div>
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
      <h2 class="text-2xl text-center p-4">You can only start a new session on a mobile device.</h2>

      <div class="flex items-center">
        <motion.button
          @click="goToAddSession"
          class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
          :whileHover="{ scale: 1.15, rotate: 3 }"
          :whileTap="{ scale: 0.9, rotate: -5 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
        >
          <font-awesome-icon icon="fa-plus" /> Add Session
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
