<script setup>
import { ref } from 'vue'
</script>

<template>
  <div id="add-run-view" class="flex flex-col">
    <h1 class="text-2xl text-center font-bold mt-32">Manually Add Run</h1>

    <h2 class="text-center m-4">
      Input the data about your run session below. Rough estimates are okay.
    </h2>

    <div id="form-container" class="flex flex-col border border-black rounded-xl px-4 py-2 m-4">
      <div clas="flex flex-row">
        <label for="run-date">Date: </label>
        <input type="date" id="run-date" class="border border-black rounded-xl p-1 m-1" required />
      </div>

      <div clas="flex flex-row">
        <label for="run-duration">Duration (in minutes): </label>
        <input
          type="number"
          id="run-duration"
          class="w-2/5 border border-black rounded-xl p-1 m-1"
          required
        />
      </div>

      <div clas="flex flex-row">
        <label for="run-distance">Distance (in miles): </label>
        <input
          type="number"
          id="run-distance"
          class="w-1/2 border border-black rounded-xl p-1 m-1"
          required
        />
      </div>

      <div class="flex flex-col my-2">
        <label for="comment">Comment (Optional): </label>
        <textarea id="comment" class="border border-black rounded-xl p-1 m-1" rows="5"></textarea>
      </div>

      <div class="flex flex-row">
        <RouterLink
          :to="{ name: 'dashboard' }"
          class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
        >
          Submit
        </RouterLink>

        <RouterLink
          :to="{ name: 'dashboard' }"
          class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
        >
          Cancel
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #add-run-view {
    align-items: center;
  }
  #form-container {
    width: 50%;
  }
  #run-duration,
  #run-distance {
    width: 20%;
  }
}
</style>
