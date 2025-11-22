<script setup>
import { ref } from 'vue'
import { motion } from "motion-v"

const transition = { duration: 4,  ease: "easeInOut" }

const box = {
    width: '50px',
    height: '50px',
    backgroundColor: "#4ff0b7", 
    borderRadius: '10px',
    position: "absolute",
    top: 0,
    left: 0,
    offsetPath: `path("M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5")`
}
</script>

<template>
  <div class="flex flex-col mt-32">
    <div class="flex flex-col items-center" id="row-1">
      <div>
        <h1 class="text-3xl text-center font-bold p-4">Welcome to Tr@ceRoute!</h1>

        <h2 class="text-2xl text-center font-bold p-4">Mission statement</h2>
      </div>

      <div class="running-animation text-center border border-black h-60 w-72 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
            <motion.path
                d="M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5"
                fill="transparent"
                stroke-width="12"
                stroke="var(--hue-6-transparent)"
                stroke-linecap="round"
                :initial="{ pathLength: 0.001 }"
                :animate="{ pathLength: 1 }"
                :transition="transition"
            />
        </svg>
        <motion.div
            :style="box"
            :initial="{ offsetDistance: '0%', scale: 2.5 }"
            :animate="{ offsetDistance: '100%', scale: 1 }"
            :transition="transition"
        />
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
      <h2 class="text-white text-2xl p-4">Join today and become part of our running family! </h2>

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
