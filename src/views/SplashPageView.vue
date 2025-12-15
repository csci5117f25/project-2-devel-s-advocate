<script setup>
import { useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { motion } from 'motion-v'
import { ref, onMounted } from 'vue'
const constraintsRef = ref(null)
import SplashPageComponent from '@/components/SplashPageComponent.vue'
import { TresCanvas } from '@tresjs/core'
const router = useRouter()

const login = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
  router.push({ name: 'dashboard' })
}

const words = ['run', 'bike', 'walk']
const currentWord = ref(words[0])
let index = 0

onMounted(() => {
  setInterval(() => {
    index = (index + 1) % words.length
    currentWord.value = words[index]
  }, 2000)
})

</script>

<template>
  <div class="flex flex-col items-center mt-32 m-12 text-off-white drop-shadow-xl/50">
    <div class="flex flex-col items-center" id="row-1">
    </div>

<div id="animation-set" class="flex flex-row justify-between mt-12">
  <div class="animation">
    <img src="../assets/gifs/walking_animation.gif" class="w-full max-w-[260px] md:max-w-[220px] lg:max-w-[260px] h-auto" />
  </div>
  <div class="half-width flex justify-center">
    <div class="relative flex items-center justify-center h-60">
      <img
        src="../assets/gifs/running_animation.gif"
        class="absolute inset-0 mx-auto h-60 opacity-40 -z-10"
      />

     <h2 class="text-4xl text-center p-4 z-10 racing-sans-one-regular">
    Built for those who love to&nbsp;

    <motion.span
      :key="currentWord"
      class="inline-block font-bold text-orange-salmon"
      :initial="{ y: -30, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :exit="{ y: 30, opacity: 0 }"
      :transition="{ duration: 0.4, ease: 'easeOut' }"
    >
      {{ currentWord }}
    </motion.span>
    !
  </h2>

    </div>
  </div>

  <div class="animation">
    <img src="../assets/gifs/biking_animation.gif" class="w-full max-w-[300px] md:max-w-[220px] lg:max-w-[300px]" />
  </div>
</div>

    <div class="flex flex-col items-center m-8" id="row-2">
      <div class="half-width">
        <h2 class="text-2xl text-center p-4 racing-sans-one-regular">Advanced Tracking so you can hit your goals!</h2>
      </div>

      <div class="half-width screenshot text-center border-6 border-orange-salmon rounded-xl">
        <img src="../assets/images/image1.png" class="rounded-xl" />
      </div>
    </div>

    <div class="flex flex-col items-center m-8" id="row-3">
      <div class="half-width">
        <h2 class="text-2xl text-center racing-sans-one-regular p-4">
          Add comments to keep track of your feelings!
        </h2>
      </div>

      <div class="half-width screenshot text-center border-6 border-orange-salmon rounded-xl">
        <img src="../assets/images/image2.png" class="rounded-xl" />
      </div>
    </div>

    <div
      id="row-5"
      class="flex flex-col text-center items-center justify-center p-4 mt-10 bottom-0 z-1000 w-full"
    >
      <h2 class="text-2xl racing-sans-one-regular p-4">Join today and become part of our running family!</h2>

      <motion.button
        @click="login"
        class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer racing-sans-one-regular"
        :whileHover="{ scale: 1.15, rotate: 3 }"
        :whileTap="{ scale: 0.9, rotate: -5 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
      >
        Begin Your Journey Today!
      </motion.button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap');

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
  .half-width {
    width: 50%;
    margin: calc(var(--spacing) * 8);
  }
  .animation {
    margin-inline: calc(var(--spacing) * 4);
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

.racing-sans-one-regular {
  font-family: "Racing Sans One", sans-serif;
  font-weight: 400;
}

</style>
