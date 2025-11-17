<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="flex flex-col mt-32">
    <div class="flex flex-col items-center" id="row-1">
      <div>
        <h1 class="text-3xl text-center font-bold p-4">Welcome to Tr@ceRoute!</h1>

        <h2 class="text-2xl text-center font-bold p-4">Mission statement</h2>
      </div>

      <div class="running-animation text-center border border-black h-60 w-72 rounded-xl">
        Running Animation
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-2">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 1</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
        Screenshot 1
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-3">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 2</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
        Screenshot 2
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-4">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 3</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
        Screenshot 3
      </div>
    </div>

    <div
      id="row-5"
      class="flex flex-col items-center justify-center bg-blue-950 p-4 mt-10 bottom-0 z-1000 w-full"
    >
      <h2 class="text-white text-2xl p-4">Join Today and Become...</h2>

      <RouterLink :to="{ name: 'dashboard' }" class="font-bold bg-white rounded-xl px-4 py-2 m-4">
        Begin Your Journey Today!
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #row-1 {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  #row-2 {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    align-items: center;
  }
  #row-3 {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  #row-4 {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    align-items: center;
  }
  #row-5 {
    align-items: center;
  }
  .screenshot {
    height: calc(var(--spacing) * 48);
    width: calc(var(--spacing) * 96);
  }
}
</style>
