<script setup>
import { ref, computed, watch } from 'vue'
import { useCollection, useCurrentUser } from 'vuefire'
import { collection, query, where, doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import ChartComponent from '@/components/ChartComponent.vue'
import EditComponent from '@/components/EditComponent.vue'
import DeleteComponent from '@/components/DeleteComponent.vue'
import HeatMapComponent from '@/components/HeatMapComponent.vue'

const user = useCurrentUser()
const filter_option = ref('all') // Have this as default
const sort_option = ref('date-desc') // Have this as default
const chart_view = ref('distance')
// TODO: Melody, comment the above line out and uncomment the following line.
// const chart_view = ref('chart-general')

//get runs for current user
const runsQuery = computed(() => {
  return user.value ? query(collection(db, 'runs'), where('userID', '==', user.value.uid)) : null
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
      case 'distance-asc':
        return (a.miles || a.distance || 0) - (b.miles || b.distance || 0)
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
      averageSpeed: 0,
      fastestAvgSpeed: 0,
      totalRunningTime: 0,
      longestRun: 0,
      totalRuns: 0,
    }
  }

  let totalMiles = 0
  let maxSpeed = 0
  let totalTime = 0
  let longestRun = 0

  runs.value.forEach((run) => {
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
  const overallAvgSpeed = totalTime > 0 ? totalMiles / (totalTime / 60) : 0
  return {
    totalMiles: parseFloat(totalMiles.toFixed(1)),
    averageSpeed: parseFloat(overallAvgSpeed.toFixed(1)),
    fastestAvgSpeed: parseFloat(maxSpeed.toFixed(1)),
    totalRunningTime: totalTime,
    longestRun,
    totalRuns: runs.value.length,
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
  { immediate: true, deep: true },
)

//chart
const chartData = computed(() => {
  if (!runs.value || runs.value.length === 0) return { labels: [], datasets: [] }

  //mapping the date to miles
  const dailyMap = {}
  runs.value.forEach((run) => {
    const date = run.startTime?.toDate?.()?.toISOString().split('T')[0] || 'Unknown'
    if (!dailyMap[date]) dailyMap[date] = { miles: 0, duration: 0 }
    dailyMap[date].miles += run.miles || 0
    dailyMap[date].duration += run.duration || 0
  })

  //sorting dates
  const labels = Object.keys(dailyMap).sort()
  //can pick chart based on the sortinf
  let data = []
  let label = ''
  switch (chart_view.value) {
    case 'distance':
    default:
      label = 'Miles Run'
      data = labels.map((d) => dailyMap[d].miles)
      break
    case 'time':
      label = 'Time per Run (minutes)'
      data = labels.map((d) => dailyMap[d].duration)
      break
  }

  return {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: '#d66853',
        borderColor: '#d66853',
        borderWidth: 1,
      },
    ],
  }
})
</script>

<template>
  <div class="flex flex-col mt-32 drop-shadow-xl/50">
    <div class="header m-2">
      <h1 class="text-3xl text-orange-salmon text-center font-bold">
        Welcome, {{ user.displayName }}!
        <!-- Welcome! -->
      </h1>
    </div>

    <!-- <div class="flex flex-row justify-evenly m-2">
      <RouterLink :to="{ name: 'startRun' }" class="font-bold bg-off-white rounded-xl px-4 py-2">
        <font-awesome-icon icon="fa-play" /> Start Run
      </RouterLink>

      <RouterLink :to="{ name: 'addRun' }" class="font-bold bg-off-white rounded-xl px-4 py-2">
        <font-awesome-icon icon="fa-plus" /> Add Run
      </RouterLink>
    </div> -->

    <div class="flex flex-row flex-wrap justify-around m-2" id="stats-container">
      <div
        class="stat w-2/5 flex flex-col text-center bg-orange-salmon border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <p>Total Miles <font-awesome-icon icon="fa-shoe-prints" /></p>
        <p class="font-bold text-2xl">{{ userStats.totalMiles }}</p>
      </div>

      <!-- <div
        class="stat flex flex-col text-center border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <p class="font-bold">Avg Speed</p>
        <p>{{ userStats.averageSpeed }} MPH</p>
      </div> -->
      <div
        class="stat w-2/5 flex flex-col text-center bg-orange-salmon border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <p>Walks <font-awesome-icon icon="fa-person-walking" /></p>
        <p class="font-bold text-2xl">{{ userStats.totalWalks || 0 }}</p>
      </div>
      <div
        class="stat w-2/5 flex flex-col text-center bg-orange-salmon border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <p>Runs <font-awesome-icon icon="fa-person-running" /></p>
        <p class="font-bold text-2xl">{{ userStats.totalRuns || 0 }}</p>
      </div>
      <div
        class="stat w-2/5 flex flex-col text-center bg-orange-salmon border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <p>Bike Rides <font-awesome-icon icon="fa-person-biking" /></p>
        <p class="font-bold text-2xl">{{ userStats.totalBikeRides || 0 }}</p>
      </div>
    </div>

    <div class="flex flex-col m-2" id="sessions-and-chart-container">
      <div
        id="sessions-container"
        class="border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <div class="flex flex-col">
          <div class="flex items-center px-2 py-2">
            <label for="filter-option">List:</label>
            <select
              v-model="filter_option"
              id="filter-option"
              class="bg-orange-salmon rounded-xl px-4 py-2 m-2"
            >
              <option value="all">All Sessions</option>
              <option value="walks-only">Walks Only</option>
              <option value="runs-only">Runs Only</option>
              <option value="bike-rides-only">Bike Rides Only</option>
            </select>
          </div>

          <div class="flex items-center px-2 py-2">
            <label for="sort-option">Sort By:</label>
            <select
              v-model="sort_option"
              id="sort-option"
              class="bg-orange-salmon rounded-xl px-4 py-2 m-2"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="distance-desc">Distance (Longest First)</option>
              <option value="distance-asc">Distance (Shortest First)</option>
              <option value="duration-desc">Duration (Longest First)</option>
              <option value="duration-asc">Duration (Shortest First)</option>
            </select>
          </div>
        </div>

        <div id="sessions-list" class="max-h-72 overflow-y-auto rounded-xl m-2">
          <div v-if="sortedRuns.length === 0" class="text-center text-off-white">
            No sessions have been tracked yet
          </div>
          <div v-else class="flex flex-col space-y-2">
            <p class="text-center">Tracked Sessions</p>
            <div
              v-for="run in sortedRuns"
              :key="run.id"
              @deleted="refreshRuns"
              class="border-2 border-orange-salmon rounded-xl p-2"
            >
              <router-link
                :to="`/completed-run/${run.id}`"
                class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all"
              >
                View Your Run!
              </router-link>
              <DeleteComponent :runID="`${run.id}`"></DeleteComponent>
     <EditComponent
  :runID="run.id"
  :description="run.description"
  :distance="run.miles"
  :duration="run.duration"
  :startTime="run.startTime"
  :endTime="run.endTime"
  :createdAt="run.createdAt"
  @updated="refreshData"
/>
            </div>
          </div>
        </div>
      </div>

      <div
        id="chart-container"
        class="border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-2"
      >
        <div class="flex flex-col">
          <select v-model="chart_view" class="bg-orange-salmon rounded-xl px-4 py-2 m-2">
            <option value="distance">Daily Miles Ran</option>
            <option value="time">Time per run</option>
          </select>
          <!-- TODO: Melody, uncomment the following code and comment out
               the above <select> element.  -->
          <!-- <div class="flex items-center">
            <label for="chart-view">Show Miles</label>
            <select
              v-model="chart_view"
              id="chart-view"
              class="border-2 border-orange-salmon rounded-xl px-4 py-2 m-2"
            >
              <option class="text-cinder" value="chart-general">Traveled</option>
              <option class="text-cinder" value="chart-walking">Walked</option>
              <option class="text-cinder" value="chart-running">Ran</option>
              <option class="text-cinder" value="chart-biking">Biked</option>
            </select>
            <p>Over Time</p>
          </div> -->
        </div>

        <ChartComponent
          :labels="chartData.labels"
          :datasets="chartData.datasets"
          title="Daily Miles Run"
        />
      </div>
      <!-- <div>
        <HeatMapComponent :runs="runs" style="height: 400px;" />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #stats-container {
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: calc(var(--spacing) * 6);
  }

  .stat {
    width: 15%;
  }

  #sessions-and-chart-container {
    flex-direction: row;
    justify-content: space-evenly;
    margin: calc(var(--spacing) * 6);
  }

  #sessions-container,
  #chart-container {
    width: 40%;
  }

  /* #sessions-list,*/
  #chart {
    height: calc(var(--spacing) * 100);
  }
}
option:hover {
  color: --color-cinder;
}
</style>
