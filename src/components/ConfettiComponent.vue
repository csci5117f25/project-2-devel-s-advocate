<script setup>
import { ref, onMounted } from 'vue'
import ConfettiExplosion from 'vue-confetti-explosion'

const showConfetti = ref(false)

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})

const triggerConfetti = () => {
  showConfetti.value = true
  setTimeout(() => {
    showConfetti.value = false
  }, 40000)
}

onMounted(() => {
  triggerConfetti()
})
</script>

<template>
  <div>
    <ConfettiExplosion
      :particleCount="400"
      :force="0.9"
      :colors="['#7D4E57', '#D66853', '#F4F3EF']"
      v-if="showConfetti"
    />
    <h1 class="text-3xl text-orange-salmon text-center font-bold p-4">
      {{ props.text }}
    </h1>
  </div>
</template>
