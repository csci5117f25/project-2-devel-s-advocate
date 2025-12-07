<script setup>
import { ref } from 'vue'
</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32 text-off-white drop-shadow-xl/50">
    <div>
      <h1 class="text-2xl text-center text-orange-salmon font-bold">Track New Exercise</h1>
    </div>

    <div class="h-75 text-center border-6 border-orange-salmon rounded-xl px-4 py-2 m-4">
      Map of User's Route (updated dynamically)
    </div>

    <div class="flex flex-row justify-between">
      <div
        class="w-2/5 text-center border-2 border-orange-salmon bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2"
      >
        0:00:00
      </div>

      <div
        class="w-2/5 text-center border-2 border-orange-salmon bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2"
      >
        XX Miles
      </div>
    </div>

    <div class="flex flex-row justify-between">
      <div
        class="w-2/5 text-center border-2 border-orange-salmon bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2"
      >
        Start
      </div>

      <RouterLink
        :to="{ name: 'completedRun', params: { runID: 1 } }"
        class="w-2/5 text-center border-2 border-orange-salmon bg-orange-salmon rounded-xl px-4 py-2 mx-4 my-2"
      >
        Finish
      </RouterLink>
    </div>

    <RouterLink
      :to="{ name: 'splashPage' }"
      class="w-11/12 text-center text-orange-salmon bg-off-white rounded-xl px-4 py-2 mx-4 my-2"
    >
      Cancel
    </RouterLink>
  </div>

  <div id="desktop-view" class="hidden mt-32 text-off-white drop-shadow-xl/50">
    <div class="h-100 w-100 text-center border-6 border-orange-salmon rounded-xl px-4 py-2">
      Mobile Phone Animation
    </div>
    <!-- <div id="mobile-phone-animation">
      <img src="../assets/gifs/mobile_phone_animation.gif" class="h-75" />
    </div> -->
    <div class="flex flex-col items-center">
      <h1 class="text-3xl text-center text-orange-salmon font-bold m-2">Oops!</h1>

      <h2 class="text-2xl p-2 m-2">A new session can only be tracked on a mobile device.</h2>

      <RouterLink
        :to="{ name: 'dashboard' }"
        class="w-1/5 text-center text-orange-salmon bg-off-white rounded-xl p-2 m-4"
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
    justify-content: center;
    align-items: center;
  }
  /* #mobile-phone-animation {
    height: calc(var(--spacing) * 100);
    width: calc(var(--spacing) * 100);
  } */
}
</style>
