<script setup>
import { ref, computed, watch } from 'vue'
import { useCollection, useCurrentUser } from 'vuefire'
import { collection, query, where, doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import ChartComponent from '@/components/chartComponent.vue'
import EditComponent from '@/components/EditComponent.vue'
import DeleteComponent from '@/components/DeleteComponent.vue'

const user = useCurrentUser()
const sort_option = ref('date-desc') //have this as defualt
const chart_view = ref('')

//get runs for current user
const runsQuery = computed(() => {
  return user.value
    ? query(
        collection(db, 'runs'),
        where('userID', '==', user.value.uid)
      )
    : null
})

const runs = useCollection(runsQuery)

//sort runs by
const sortedRuns = computed(() => {
  if (!runs.value) return []

  return [...runs.value].sort((a, b) => {
    switch (sort_option.value) {
      case 'date-asc':
        return (a.startTime?.toDate() || 0) - (b.startTime?.toDate() || 0)
      case 'date-desc':
        return (b.startTime?.toDate() || 0) - (a.startTime?.toDate() || 0)
      case 'distance-desc':
        return (b.miles || b.distance || 0) - (a.miles || a.distance || 0)
      case 'duration-desc':
        return (b.duration || 0) - (a.duration || 0)
      case 'duration-asc':
        return (a.duration || 0) - (b.duration || 0)
      default:
        return (b.startTime?.toDate() || 0) - (a.startTime?.toDate() || 0)
    }
  })
})

//computing the stats for current user
const userStats = computed(() => {
  if (!runs.value || runs.value.length === 0) {
    return {
      totalMiles: 0,
      fastestAvgSpeed: 0,
      totalRunningTime: 0,
      longestRun: 0,
      totalRuns: 0
    }
  }

  let totalMiles = 0
  let maxSpeed = 0
  let totalTime = 0
  let longestRun = 0

  runs.value.forEach(run => {
    const miles = run.miles || run.distance || 0
    const duration = run.duration || 0

    totalMiles += miles
    totalTime += duration
    if (duration > longestRun) longestRun = duration

    //calculating average speed in mph
    if (duration > 0) {
      const avgSpeed = miles / (duration / 60)
      if (avgSpeed > maxSpeed) maxSpeed = avgSpeed
    }
  })

  return {
    totalMiles: parseFloat(totalMiles.toFixed(1)),
    fastestAvgSpeed: parseFloat(maxSpeed.toFixed(1)),
    totalRunningTime: totalTime,
    longestRun,
    totalRuns: runs.value.length
  }
})

//update user stats in Firestore whenever stats change
watch(
  userStats,
  async (newStats) => {
    if (!user.value) return

    const statsDocRef = doc(db, 'users', user.value.uid, 'private', 'stats')
    try {
      await setDoc(statsDocRef, newStats, { merge: true })
    } catch (err) {
      console.error('Error updating user stats:', err)
    }
  },
  { immediate: true, deep: true }
)

//chart
const chartData = computed(() => {
  if (!runs.value || runs.value.length === 0) return { labels: [], datasets: [] }

  //mapping the date to miles
  const dailyMap = {}
  runs.value.forEach(run => {
    const date = run.startTime?.toDate?.()?.toISOString().split('T')[0] || 'Unknown'
    if (!dailyMap[date]) dailyMap[date] = 0
    dailyMap[date] += run.miles || 0
  })

  //sorting dates
  const labels = Object.keys(dailyMap).sort()
  const data = labels.map(d => dailyMap[d])

  return {
    labels,
    datasets: [
      {
        label: 'Miles Run',
        data,
        backgroundColor: 'rgb(243, 173, 157)',
        borderColor: 'rgb(243, 173, 157)',
        borderWidth: 1
      }
    ]
  }
})

</script>

<template>
  <div class="flex flex-col mt-32">
    <div class="header m-2">
      <h1 class="text-2xl text-center font-bold">Dashboard</h1>
    </div>

    <div class="flex flex-row justify-evenly m-2">
      <RouterLink
        :to="{ name: 'startRun' }"
        class="font-bold border border-black rounded-xl px-4 py-2"
      >
        Start Run
      </RouterLink>

      <RouterLink
        :to="{ name: 'addRun' }"
        class="font-bold border border-black rounded-xl px-4 py-2"
      >
        Add Run
      </RouterLink>
    </div>

    <div class="flex flex-col items-center">
      <div class="font-bold text-center w-3/4 border border-black rounded-xl px-4 py-2 m-2">
        Your Stats
      </div>
      <div class="flex flex-row flex-wrap justify-around m-2" id="stats-container">
        <div class="text-center border border-black rounded-xl px-4 py-2 m-2">
          Fastest Average Speed: {{ userStats.fastestAvgSpeed }} mph
        </div>
        <div class="text-center border border-black rounded-xl px-4 py-2 m-2">Total Sessions: {{ runs.value?.length || 0 }}</div>
        <div class="text-center border border-black rounded-xl px-4 py-2 m-2">{{ userStats.totalMiles }} Miles Ran</div>
      </div>
    </div>

    <div class="flex flex-col" id="sessions-and-chart-container">
      <div id="sessions-container" class="border border-black rounded-xl px-4 py-2 m-2">
        <select v-model="sort_option" class="border border-black rounded-xl px-4 py-2 m-2">
          <option disabled hidden value="">Sort Sessions By</option>
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="distance-desc">Distance (Longest First)</option>
          <option value="duration-desc">Duration (Longest First)</option>
          <option value="duration-asc">Duration (Shortest First)</option>
        </select>

        <div id="sessions-list" class="h-72 overflow-y-auto border border-black rounded-xl px-4 py-2 m-2">
          <div v-if="sortedRuns.length === 0" class="text-center text-gray-500">
            No runs yet
          </div>
          <div v-else class="flex flex-col space-y-2">
            <div v-for="run in sortedRuns" :key="run.id" @deleted="refreshRuns" class="border border-black rounded-xl p-2">
              <DeleteComponent :runID="`${run.id}`"></DeleteComponent>
              <p><strong>Date:</strong> {{ run.startTime?.toDate()?.toLocaleDateString() || '—' }}</p>
              <p><strong>Distance:</strong> {{ run.miles || run.distance || '—' }} miles</p>
              <p><strong>Duration:</strong> {{ run.duration || '—' }} min</p>
              <p v-if="run.path?.length"><strong>Tracked Miles:</strong> {{ run.miles || run.distance || '—' }} miles</p>
              <p v-if="run.description"><strong>Comment:</strong> <EditComponent :runID="`${run.id}`" :description="`${run.description}`"></EditComponent></p> 
            </div>
          </div>
        </div>
      </div>

      <div id="chart-container" class="border border-black rounded-xl px-4 py-2 m-2">
        <select v-model="chart_view" class="border border-black rounded-xl px-4 py-2 m-2">
          <option disabled hidden value="">Choose Chart View</option>
          <option value="distance">Daily Miles Run</option>
          <option>B</option>
          <option>C</option>
        </select>

        <ChartComponent
          :labels="chartData.labels"
          :datasets="chartData.datasets"
          title="Daily Miles Run"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #stats-container {
    width: 50%;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  #sessions-and-chart-container {
    flex-direction: row;
    justify-content: space-evenly;
  }

  #sessions-container,
  #chart-container {
    width: 40%;
  }

  #sessions-list,
  #chart {
    height: calc(var(--spacing) * 100);
  }
}
</style>
