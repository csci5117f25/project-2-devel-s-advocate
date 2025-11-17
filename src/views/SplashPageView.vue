<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="flex flex-col mt-32">
    <div class="flex flex-col items-center" id="row-1">
      <div>
        <h1 class="text-2xl text-center font-bold p-4">Welcome to Tr@ceRoute!</h1>

        <h2 class="text-1xl text-center font-bold p-4">Mission statement</h2>
      </div>

      <div class="running-animation text-center border border-black h-36 w-48">
        Running Animation
      </div>
    </div>

    <!-- <div>

    </div>

    <div>

    </div>

    <div>

    </div>

    <div>

    </div> -->
  </div>
  <!-- <h1 class="text-8xl text-center font-bold mt-32 p-4">Welcome to Tr@ceRoute!</h1>

  <h2 class="text-4xl text-center mt-8 mb-12">A personal to-do list web application that ...</h2>

  <div class="grid grid-cols-2 text-center">
    <div>
      <h1 class="bg-red-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">Feature 1</h1>
      <h1 class="bg-yellow-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">
        Screenshot of finished /todo/:id page
      </h1>
      <h1 class="bg-blue-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">Feature 3</h1>
    </div>

    <div>
      <h1 class="bg-orange-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">
        Screenshot of finished /todos page
      </h1>
      <h1 class="bg-green-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">Feature 2</h1>
      <h1 class="bg-purple-500 h-64 m-8 drop-shadow-xl/15 rounded-xl">
        Screenshot of finished /done page
      </h1>
    </div>
  </div>

  <h2 class="text-2xl text-center mt-8 mb-16">Login so that you can start ... today!</h2> -->
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
