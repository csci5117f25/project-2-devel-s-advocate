<script setup>
import { motion } from "motion-v"
import { ref } from "vue"
const constraintsRef = ref(null)

</script>

<template>

  <div class="flex flex-col mt-32">
    <div class="flex flex-col items-center" id="row-1">
      <div>
        <h1 class="text-3xl text-center font-bold p-4">Welcome to Tr@ceRoute!</h1>

        <h2 class="text-2xl text-center font-bold p-4">Mission statement</h2>
      </div>

      <div class="running-animation text-center border border-black h-60 w-72 rounded-xl" style="position: relative">
        <div ref="constraintsRef" class="constraints">
        <motion.div
            drag
            :dragConstraints="constraintsRef"
            :dragElastic="0.2"
            class="box"
        />
    </div>
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-2">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 1</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
       <motion.img
       src="../assets/images/image1.png" />
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-3">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 2</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
        <motion.img
        src="../assets/images/image2.png" />
      </div>
    </div>

    <div class="flex flex-col items-center mt-8" id="row-4">
      <div>
        <h2 class="text-2xl text-center font-bold p-4">Statement 3</h2>
      </div>

      <div class="screenshot text-center border border-black h-36 w-72 rounded-xl">
        <motion.img
        src="../assets/images/image3.png" />
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
.constraints {
    width: 300px;
    height: 300px;
    background-color: var(--hue-1-transparent);
    border-radius: 10px;
}

.box {
    width: 100px;
    height: 100px;
    border-radius: 10px;

    background-image: url('../assets/images/P2-Logo\ 3\ tr.png');
    background-size: cover; 
    background-position: center;
    background-repeat: no-repeat;
}
</style>
