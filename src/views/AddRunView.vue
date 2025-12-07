<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { db } from '@/firebaseApp'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const user = useCurrentUser()

const date = ref('')
const exerciseType = ref('')
const startTime = ref('')
const endTime = ref('')
const distance = ref('')
const comment = ref('')

const submitRun = async () => {
  if (!user.value) return

  if (!date.value || !startTime.value || !endTime.value || !distance.value) {
    alert('Please fill in all required fields')
    return
  }

  const start = new Date(`${date.value}T${startTime.value}`)
  const end = new Date(`${date.value}T${endTime.value}`)
  const durationMinutes = Math.round((end - start) / 60000)
  if (durationMinutes < 1) {
    alert('Your start time and end time is wrong!')
    return
  }

  const docRef = await addDoc(collection(db, 'runs'), {
    createdAt: serverTimestamp(),
    startTime: start,
    endTime: end,
    duration: durationMinutes,
    miles: Number(distance.value),
    description: comment.value || '',
    path: [],
    userID: user.value.uid,
  })

  const runID = docRef.id
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div id="add-run-view" class="flex flex-col drop-shadow-xl/50">
    <h1 class="text-2xl text-center text-orange-salmon font-bold mt-32">Manually Add Run</h1>

    <h2 class="text-center text-white m-4">
      Input the data about your run session below. Rough estimates are okay.
    </h2>

    <div
      id="form-container"
      class="flex flex-col border-6 border-orange-salmon text-off-white rounded-xl px-4 py-2 m-4"
    >
      <div class="flex flex-row items-center">
        <label for="run-date">Date: </label>
        <input
          v-model="date"
          type="date"
          id="run-date"
          class="border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="exercise-type">Exercise Type: </label>
        <select
          v-model="exerciseType"
          id="exercise-type"
          class="border-2 border-orange-salmon rounded-xl p-1 m-2"
        >
          <option class="text-cinder" value="type-walk">Walk</option>
          <option class="text-cinder" value="type-run">Run</option>
          <option class="text-cinder" value="type-bike-ride">Bike Ride</option>
        </select>
      </div>

      <div class="flex flex-row items-center">
        <label for="start-time">Start Time: </label>
        <input
          v-model="startTime"
          type="time"
          id="start-time"
          class="border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="end-time">End Time: </label>
        <input
          v-model="endTime"
          type="time"
          id="end-time"
          class="border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="run-distance">Distance (in miles): </label>
        <input
          v-model="distance"
          type="number"
          id="run-distance"
          class="w-1/4 border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-col my-2">
        <label for="comment">Comment (Optional): </label>
        <textarea
          v-model="comment"
          id="comment"
          class="border-2 border-orange-salmon rounded-xl p-1 my-2"
          rows="3"
        ></textarea>
      </div>

      <div class="flex flex-row justify-center">
        <button
          @click="submitRun"
          class="text-center border-2 border-orange-salmon rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
        >
          Submit
        </button>

        <RouterLink
          :to="{ name: 'dashboard' }"
          class="text-center border-2 border-orange-salmon rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
        >
          Cancel
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  #add-run-view {
    align-items: center;
  }
  #form-container {
    width: 50%;
  }
  #run-distance {
    width: 15%;
  }
}
/* Changes the icon to a light color suitable for dark backgrounds. */
input[type='date'],
input[type='time'] {
  color-scheme: dark;
}
</style>
