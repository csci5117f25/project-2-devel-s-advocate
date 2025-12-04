<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRunTracking } from '../assets/js/runTracking.js'
import { useRunStore } from '../assets/js/runStore.js'
import { saveRun } from '../assets/js/dbHelper.js'
import { useCurrentUser } from 'vuefire'
import { useRouter } from 'vue-router'

const mapRef = ref(null)
const map = ref(null)
const loading = ref(true)

const store = useRunStore()
const { startTracking, stopTracking, centerMapOnUser } = useRunTracking(map)

const router = useRouter()
const user = useCurrentUser()

const tracking = computed(() => store.isTracking)
const distance = computed(() => store.distance)
//const track = computed(() => store.track)
//const simplifiedCount = computed(() => store.polyline?.getPath()?.getLength() || 0)

const toggle = () => tracking.value ? finishAndSave() : startTracking()
const finishAndSave = async () => {
  stopTracking()
  
  if (!user.value) {
    alert('You must be logged in to save runs')
    return
  }

  const endTime = new Date()
  const startTime = new Date(store.startTime)
  const durationMinutes = Math.round((endTime - startTime) / 60000)
  const miles = store.distance * 0.000621371 // Convert meters to miles

  try {
    await saveRun({
      startTime: startTime,
      endTime: endTime,
      duration: durationMinutes,
      miles: Number(miles.toFixed(2)),
      description: '',
      path: store.track,
      userID: user.value.uid
    })

    alert(`Run saved! Distance: ${formatDistance(store.distance)}`)
    store.reset()
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Error saving run:', error)
    alert('Failed to save run. Please try again.')
  }
}

function formatDistance(meters) {
  //convert to miles
  const miles = meters * 0.000621371
  return miles.toFixed(2) + ' mi'
}

onMounted(async () => {
  await loadGoogleMaps()
  const position = await centerMapOnUser()
  initMap(position)
  loading.value = false
})

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

function initMap(position = null) {
  const center = position ? { lat: position.coords.latitude, lng: position.coords.longitude } : { lat: 37.77, lng: -122.41 }
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

  const polyline = new window.google.maps.Polyline({
    geodesic: true,
    strokeColor: '#FF3B30',
    strokeOpacity: 1.0,
    strokeWeight: 5,
    map: map.value
  })

  store.setPolyline(polyline)
}

</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32">
    <div>
      <h1 class="text-2xl text-center font-bold">Start Run View</h1>
    </div>

    <div class="border border-black rounded-xl m-4" style="height: 400px;">
      <div id="map" ref="mapRef" style="height: 100%;"></div>
    </div>

    <div class="flex flex-row justify-between">
      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        0:00:00
      </div>

      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        {{ formatDistance(distance) }}
      </div>
    </div>

    <div class="flex flex-row justify-between">
      <div
        @click="toggle"
        class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
      >
        {{ tracking ? 'Stop' : 'Start' }}
      </div>
    </div>

    <RouterLink
      :to="{ name: 'splashPage' }"
      class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
    >
      Cancel
    </RouterLink>
  </div>

  <div id="desktop-view" class="hidden mt-32">
    <div class="h-100 w-100 text-center border border-black rounded-xl px-4 py-2">
      Mobile Phone Animation
    </div>
    <div class="flex flex-col">
      <h1 class="text-3xl text-center font-bold m-2">Oops!</h1>

      <h2 class="text-2xl p-2 m-2">A new run can only be tracked on a mobile device.</h2>

      <RouterLink
        :to="{ name: 'splashPage' }"
        class="text-center border border-black rounded-xl p-2 m-4"
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
