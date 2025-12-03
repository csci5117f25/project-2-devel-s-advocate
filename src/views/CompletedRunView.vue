<script setup>
import { ref } from 'vue'
import ConfettiComponent from '@/components/ConfettiComponent.vue'
import { collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import { useRoute } from 'vue-router'

const route = useRoute()
const runID = route.params.runID
const docRef = doc(db, 'runs', runID)
const newComment = ref('')

const addCommentToRun = async () => {
  await updateDoc(docRef, {
    description: newComment.value,
  })

  newComment.value = ''
}
</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32">
    <div>
      <ConfettiComponent text="Congratulations!"></ConfettiComponent>
    </div>

    <div class="comment-button text-center border border-black rounded-xl px-4 py-2 m-4">
<textarea
  v-model="newComment"
  placeholder="Write a comment about your run!"
  rows="4"
  class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         resize-none whitespace-pre-wrap"
></textarea>

      <button
        @click="addCommentToRun()"
        class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl 
         shadow-sm hover:bg-indigo-700 active:bg-indigo-800 
         transition-all"
         >
        Submit Comment
      </button>
    </div>

    <div class="text-center border border-black rounded-xl px-4 py-2 m-4">See your stats</div>

    <div class="h-75 text-center border border-black rounded-xl px-4 py-2 m-4">
      Map of User's Complete Route
    </div>

    <div class="flex flex-row justify-between">
      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        0:00:00
      </div>

      <div class="w-2/5 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2">
        XX Miles
      </div>
    </div>

    <RouterLink
      :to="{ name: 'dashboard' }"
      class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
    >
      Return to Dashboard
    </RouterLink>
  </div>

  <div id="desktop-view" class="hidden mt-32">
    <div class="h-100 w-100 text-center border border-black rounded-xl px-4 py-2">
      Mobile Phone Animation
    </div>
    <div class="flex flex-col">
      <h1 class="text-3xl text-center font-bold m-2">Oops!</h1>

      <h2 class="text-2xl p-2 m-2">
        The stats of a new run can only be viewed on a mobile device.
      </h2>

      <RouterLink
        :to="{ name: 'splashPage' }"
        class="text-center border border-black rounded-xl p-2 m-4"
      >
        Return Home
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #mobile-view {
    display: none;
  }
  #desktop-view {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
