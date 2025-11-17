<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>

<template>
  <div>

    <!-- layout for id:1  -->
    <div v-if="id === '1'" class="layout-one flex flex-col">

      <div class="flex flex-col items-center mt-32" id="row-1">
        <div class="phone-animation text-center border border-black h-36 w-90 rounded-xl flex items-center justify-center mt-2">
            Mobile Phone Animation
        </div>

        <div class="flex flex-col items-center">
        <h1 class="text-2xl text-center font-bold p-4">Oops!</h1>
        <h2 class="text-2xl text-center font-bold p-4">The stats of a new run can only be viewed on a mobile device.</h2>

        <div class="return-home text-center border border-black h-10 w-32 rounded-xl flex items-center justify-center mt-2">
          Return Home
        </div>
      </div>
      </div>

      


    </div>

    <!--  layout for id:2  -->
    <div v-else-if="id === '2'" class="layout-two">
      <!-- Put your Run #2 design here -->
      <div class="flex flex-col items-center mt-32" id="row-1">

        <div class="flex flex-col items-center gap-4 mt-2">
          <h1 class="text-2xl text-center font-bold p-4">Congratulations!</h1>

          <div class="vinctory-animation text-center border border-black h-36 w-90 rounded-xl flex items-center justify-center mt-2">
            Victory Animation
          </div>
        </div>

        <div class="flex flex-col items-center gap-4 mt-2">
          <div class="comment_button text-center border border-black h-10 w-32 flex justify-center items-center rounded-xl">
          Add an optional comment
          </div>

          <div class="stats_button text-center border border-black h-10 w-32 flex justify-center items-center rounded-xl">
          See your stats
          </div>
        </div>


        <div class="map_button text-center border border-black h-36 w-90 rounded-xl flex items-center justify-center mt-2">
          Map of User's Complete Route
        </div>

        <div class="flex flex-row gap-4 mt-2">
          <div class="timer_indicator text-center border border-black h-10 w-32 rounded-xl flex items-center justify-center">
            0:00:00
          </div>

          <div class="distance-indicator text-center border border-black h-10 w-32 rounded-xl flex items-center justify-center">
            XX Miles
          </div>
        </div>
        
        <div class="flex flex-col items-center gap-4 mt-2">
        <div class="return_button text-center border border-black h-10 w-32 flex justify-center items-center rounded-xl">
          Return Home
        </div>
        </div>

      </div>
    </div>

    
    <div v-else class="layout-default">
      <h1 class="text-xl font-bold text-center mt-8">Unknown Run</h1>
      <p class="text-center">This run ID does not exist.</p>
    </div>

  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #row-1 {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
