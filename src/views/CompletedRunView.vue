<script setup>
import {ref} from 'vue'
import ConfettiComponent from '@/components/ConfettiComponent.vue';
import { collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebaseApp'
import { useCurrentUser } from 'vuefire'
import { useRoute } from 'vue-router';

const route = useRoute()
const runID = route.params.runID
const docRef = doc(db, 'runs', runID)

const user = useCurrentUser()
const newComment = ref('')

const addCommentToRun = async () => {
  await updateDoc(docRef, {
      description: newComment.value
    });

  newComment.value = ''
}
</script>

<template>
  <div id="mobile-view" class="flex flex-col mt-32">
    <div>
      <ConfettiComponent text="Congratulations!"></ConfettiComponent>
    </div>

    <div class="comment-button text-center border border-black rounded-xl px-4 py-2 m-4">
      <button @click="addCommentToRun()">Submit Comment</button>
      <input v-model="newComment" placeholder="Write a comment..." />

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
      :to="{ name: 'splashPage' }"
      class="w-11/12 text-center border border-black rounded-xl px-4 py-2 mx-4 my-2"
    >
      Return Home
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
