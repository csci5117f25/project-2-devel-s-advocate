<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav
    class="flex justify-between items-center bg-blue-950 h-24 px-5 drop-shadow-xl/25 fixed top-0 z-1000 w-full"
  >
    <RouterLink :to="{ name: 'dashboard' }" class="text-3xl text-white font-bold">
      Tr@ceRoute
    </RouterLink>

    <RouterLink :to="{ name: 'dashboard' }" class="font-bold bg-white rounded-xl px-4 py-2">
      <font-awesome-icon icon="fa-user" /><slot class="text-blue-950"> Login</slot>
    </RouterLink>
  </nav>
</template>

<style scoped></style>
