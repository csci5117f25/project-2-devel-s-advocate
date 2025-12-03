<script setup>
import { ref, defineProps, onMounted } from 'vue';
import ConfettiExplosion from 'vue-confetti-explosion';

const showConfetti = ref(false);

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

const triggerConfetti = () => {
  showConfetti.value = true;
  setTimeout(() => {
    showConfetti.value = false;
  }, 40000);
};

onMounted(() => {
  triggerConfetti();
});
</script>

<template>
  <div>
    <ConfettiExplosion :particleCount="400" :force="0.9" :colors="['#11151C', '#212D40', '#364156', '#7D4E57']" v-if="showConfetti" />
    <h1 class="text-2xl text-center font-bold p-4">
      {{ props.text }}
    </h1>
  </div>
</template>