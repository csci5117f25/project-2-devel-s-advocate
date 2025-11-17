<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="flex flex-col">

    <div class="flex flex-col items-center mt-32" id="row-1">

      <div class="flex flex-col items-center">
        <h1 class="text-2xl text-center font-bold p-4">Oops!</h1>
        <h2 class="text-2xl text-center font-bold p-4">404 message</h2>

        <div class="return-home text-center border border-black h-10 w-32 rounded-xl flex items-center justify-center mt-2">
          Return Home
        </div>
      </div>

      
      <div class="tired-animation text-center border border-black h-36 w-90 flex justify-center items-center flex-col rounded-xl gap-4 mt-5">
        Tired Animation
      </div>

    </div>

  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #row-1 {
    flex-direction: row-reverse;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
