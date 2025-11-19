<script setup>
import { ref } from 'vue'
import { getUserData } from '@/assets/js/dbHelper'
const sort_option = ref('')
const chart_view = ref('')
const user_data = getUserData()
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
          Fastest Average Speed
        </div>
        <div class="text-center border border-black rounded-xl px-4 py-2 m-2">Total Sessions</div>
        <div class="text-center border border-black rounded-xl px-4 py-2 m-2">{{ user_data?.stats?.totalMiles || 0 }} Miles Run</div>
      </div>
    </div>

    <div class="flex flex-col" id="sessions-and-chart-container">
      <div id="sessions-container" class="border border-black rounded-xl px-4 py-2 m-2">
        <select v-model="sort_option" class="border border-black rounded-xl px-4 py-2 m-2">
          <option disabled hidden value="">Sort Sessions By</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <div id="sessions-list" class="h-75 border border-black rounded-xl px-4 py-2 m-2">
          List of all run relevant sessions
        </div>
      </div>

      <div id="chart-container" class="border border-black rounded-xl px-4 py-2 m-2">
        <select v-model="chart_view" class="border border-black rounded-xl px-4 py-2 m-2">
          <option disabled hidden value="">Choose Chart View</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <div id="chart" class="h-75 border border-black rounded-xl px-4 py-2 m-2">Chart</div>
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
