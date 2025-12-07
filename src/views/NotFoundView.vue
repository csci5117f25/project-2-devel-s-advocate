<script setup>
import { ref, watchEffect } from 'vue'
import { useCurrentUser } from 'vuefire'
import { RouterLink } from 'vue-router'

const user = useCurrentUser()
const targetRoute = ref('splashPage')

watchEffect(() => {
  targetRoute.value = user.value ? 'dashboard' : 'splashPage'
})
</script>

<template>
  <div id="main-container" class="flex flex-col mt-32 text-white">
    <div class="flex flex-col items-center">
      <h1 class="text-3xl text-center text-orange-salmon font-bold p-4">Oops!</h1>
      <h2 class="text-2xl text-center p-4">404 Message</h2>

      <RouterLink
        :to="{ name: targetRoute }"
        class="w-11/12 text-center border-2 border-orange-salmon rounded-xl px-4 py-2 mx-4 my-2"
      >
        Return Home
      </RouterLink>
    </div>

    <div id="tired-animation" class="text-center border-6 border-orange-salmon h-75 rounded-xl m-4">
      Tired Animation
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #main-container {
    flex-direction: row-reverse;
    justify-content: space-around;
    align-items: center;
  }
  #tired-animation {
    height: calc(var(--spacing) * 100);
    width: calc(var(--spacing) * 100);
  }
}
</style>
