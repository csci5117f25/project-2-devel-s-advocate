<script setup>
    import { ref, defineProps } from 'vue';
    import ConfettiExplosion from 'vue-confetti-explosion';

    const showConfetti = ref(false);
    const props = defineProps({
  text: {
    type: String,
    required: true
  }
})
console.log(props)
    const triggerConfetti = () => {
      showConfetti.value = true;
      setTimeout(() => {
        showConfetti.value = false;
      }, 2000); // Hide confetti after 2 seconds
    };
</script>

<template>
         <ConfettiExplosion v-if="showConfetti" />
         <button @click="triggerConfetti">        <h1 class="text-2xl text-center font-bold p-4">{{ props.text }}</h1>
         </button>
</template>