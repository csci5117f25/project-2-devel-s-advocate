<script setup>
import { ref, watchEffect } from 'vue'
import { useCurrentUser } from 'vuefire'
import { useRouter } from 'vue-router'
import { motion } from 'motion-v'

const router = useRouter()

const user = useCurrentUser()
const targetRoute = ref('splashPage')

watchEffect(() => {
  targetRoute.value = user.value ? 'dashboard' : 'splashPage'
})

function goToDashboard() {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div id="main-container" class="flex flex-col items-center mt-32 text-white drop-shadow-xl/50">
    <div id="tired-animation">
      <img src="../assets/gifs/tired_animation.gif" class="h-75" />
    </div>

    <div class="flex flex-col items-center">
      <h1 class="text-3xl text-center text-orange-salmon font-bold p-4">Oops!</h1>
      <h2 class="text-2xl text-center p-4">This page could not be found.</h2>

      <motion.button
        @click="goToDashboard"
        class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
        :whileHover="{ scale: 1.15, rotate: 3 }"
        :whileTap="{ scale: 0.9, rotate: -5 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
      >
        <font-awesome-icon icon="fa-home" /> Return Home
      </motion.button>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #main-container {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: calc(var(--spacing) * 60);
  }
  #tired-animation {
    height: calc(var(--spacing) * 100);
    width: calc(var(--spacing) * 100);
  }
}
</style>
