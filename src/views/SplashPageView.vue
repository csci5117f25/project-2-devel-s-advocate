<script setup>
import { useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { motion } from 'motion-v'
import { ref, onMounted } from 'vue'
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
    <div class="flex flex-col items-center" id="row-1"></div>

    <div id="animation-set" class="flex flex-row justify-between mt-12">
      <div class="animation">
        <img
          src="../assets/gifs/walking_animation.gif"
          class="w-full max-w-[260px] md:max-w-[220px] lg:max-w-[260px] h-auto"
        />
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
        <img
          src="../assets/gifs/biking_animation.gif"
          class="w-full max-w-[300px] md:max-w-[220px] lg:max-w-[300px]"
        />
      </div>
    </div>

    <div id="flyby-container" class="flex flex-col mt-8">
      <div class="flex flex-col items-center mt-4 mx-2" id="row-2">
        <h2 class="text-2xl text-center p-4 racing-sans-one-regular">
          View your stats, recent sessions, and performance charts at a glance
        </h2>

        <img
          src="../assets/images/dashboard_mobile_1.jpeg"
          class="half-width screenshot rounded-xl m-4 border-2 border-off-white"
        />
      </div>

      <div class="flex flex-col items-center mt-4 mx-2" id="row-3">
        <h2 class="text-2xl text-center racing-sans-one-regular p-4">
          Dynamically track an exercise session in real time
        </h2>

        <img
          src="../assets/images/start_session_mobile.jpeg"
          class="half-width screenshot rounded-xl m-4 border-2 border-off-white"
        />
      </div>

      <div class="flex flex-col items-center mt-4 mx-2" id="row-4">
        <h2 class="text-2xl text-center p-4 racing-sans-one-regular">
          Manually add an exercise session to not miss any milestone
        </h2>

        <img
          src="../assets/images/add_session_mobile.jpeg"
          class="half-width screenshot rounded-xl m-4 border-2 border-off-white"
        />
      </div>
    </div>

    <div
      id="row-5"
      class="flex flex-col text-center items-center justify-center mt-8 bottom-0 z-1000 w-full"
    >
      <h2 class="text-2xl racing-sans-one-regular p-4">
        Join today and become part of our tracking family!
      </h2>

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
  #flyby-container {
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }
  #row-2 {
    justify-content: space-evenly;
    align-items: center;
  }
  #row-3 {
    justify-content: space-evenly;
    align-items: center;
  }
  #row-4 {
    justify-content: space-evenly;
    align-items: center;
  }
  #row-5 {
    align-items: center;
  }
  .half-width {
    width: 80%;
  }
  .animation {
    margin-inline: calc(var(--spacing) * 4);
  }
}

.racing-sans-one-regular {
  font-family: 'Racing Sans One', sans-serif;
  font-weight: 400;
}
</style>
