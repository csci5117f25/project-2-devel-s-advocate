<script setup>
import { useRoute } from 'vue-router' 
import {ref} from 'vue'
import ConfettiComponent from '@/components/ConfettiComponent.vue';

</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32">
    <div>
      <h1 class="text-2xl text-center font-bold p-4">Congratulations!</h1>
    </div>

    <div class="victory-animation text-center border border-black h-75 rounded-xl px-4 py-2 m-4">
<ConfettiComponent>

</ConfettiComponent>
    </div>

    <div class="comment-button text-center border border-black rounded-xl px-4 py-2 m-4">
<button @click="commentFunction()"> Comment Here</button>
        <input
          type="text"
          v-model="newTask"
          class="w-half border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="a task"
          required
        />
    </div>

    <div class="text-center border border-black rounded-xl px-4 py-2 m-4">See your stats</div>

    <div class="h-75 text-center border border-black rounded-xl px-4 py-2 m-4">
      Map of User's Complete Route
    </div>

    <div class="flex flex-row justify-between">
      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        0:00:00
      </div>

      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        XX Miles
      </div>
    </div>

    <RouterLink
      :to="{ name: 'splashPage' }"
      class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
    >
      Return Home
    </RouterLink>
  </div>

  <div id="desktop-view" class="hidden mt-32">
    <div class="h-100 w-100 text-center border border-black rounded-xl px-4 py-2">
      Mobile Phone Animation
    </div>
    <div class="flex flex-col">
      <h1 class="text-3xl text-center font-bold m-2">Oops!</h1>

      <h2 class="text-2xl p-2 m-2">
        The stats of a new run can only be viewed on a mobile device.
      </h2>

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
