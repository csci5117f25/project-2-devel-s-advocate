<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { motion } from 'motion-v'
import { ref } from 'vue'
const constraintsRef = ref(null)

const router = useRouter()

const login = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="flex flex-col items-center mt-32 m-12 text-off-white drop-shadow-xl/50">
    <div class="flex flex-col items-center" id="row-1">
      <div class="half-width">
        <h1 class="text-3xl text-center text-orange-salmon font-bold p-4">Welcome!</h1>

        <h2 class="text-2xl text-center font-bold p-4">
          Built for those who love to exercise and track their progress!
        </h2>
      </div>

      <div
        class="half-width running-animation text-center border-6 border-orange-salmon rounded-xl"
        style="position: relative"
      >
        <div ref="constraintsRef" class="constraints">
          <motion.div drag :dragConstraints="constraintsRef" :dragElastic="0.2" class="box" />
        </div>
      </div>
    </div>

    <div id="animation-set" class="flex flex-row justify-between mt-12">
      <div class="animation">
        <img src="../assets/gifs/walking_animation.gif" class="h-60" />
      </div>
      <div class="animation">
        <img src="../assets/gifs/running_animation.gif" class="h-60" />
      </div>
      <div class="animation">
        <img src="../assets/gifs/biking_animation.gif" class="h-75" />
      </div>
    </div>

    <div class="flex flex-col items-center m-8" id="row-2">
      <div class="half-width">
        <h2 class="text-2xl text-center font-bold p-4">Fun User Features</h2>
      </div>

      <div class="half-width screenshot text-center border-6 border-orange-salmon rounded-xl">
        <img src="../assets/images/image1.png" class="rounded-xl" />
      </div>
    </div>

    <div class="flex flex-col items-center m-8" id="row-3">
      <div class="half-width">
        <h2 class="text-2xl text-center font-bold p-4">
          Advanced Tracking so you can hit your goals!
        </h2>
      </div>

      <div class="half-width screenshot text-center border-6 border-orange-salmon rounded-xl">
        <img src="../assets/images/image2.png" class="rounded-xl" />
      </div>
    </div>

    <div class="flex flex-col items-center m-8" id="row-4">
      <div class="half-width">
        <h2 class="text-2xl text-center font-bold p-4">
          Add comments to your runs to keep track of your feelings!
        </h2>
      </div>

      <div class="half-width screenshot text-center border-6 border-orange-salmon rounded-xl">
        <img src="../assets/images/image3.png" class="rounded-xl" />
      </div>
    </div>

    <div
      id="row-5"
      class="flex flex-col text-center items-center justify-center p-4 mt-10 bottom-0 z-1000 w-full"
    >
      <h2 class="text-2xl p-4">Join today and become part of our running family!</h2>

      <button
        @click="login"
        class="px-4 py-2 cursor-pointer rounded-xl bg-off-white text-center text-orange-salmon"
      >
        Begin Your Journey Today!
      </button>
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
</style>
