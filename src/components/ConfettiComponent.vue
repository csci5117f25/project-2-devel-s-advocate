<script setup>
    import { ref } from 'vue';
    import ConfettiExplosion from 'vue-confetti-explosion';

    const showConfetti = ref(false);

    const triggerConfetti = () => {
      showConfetti.value = true;
      setTimeout(() => {
        showConfetti.value = false;
      }, 2000); // Hide confetti after 2 seconds
    };
</script>

<template>
         <ConfettiExplosion v-if="showConfetti" />
         <button @click="triggerConfetti">Celebrate!</button>
</template>