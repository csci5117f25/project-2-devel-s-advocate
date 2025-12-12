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

  if (!date.value || !startTime.value || !endTime.value || !distance.value || !exerciseType.value) {
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

  try {
    await addDoc(collection(db, 'runs'), {
      createdAt: serverTimestamp(),
      startTime: start,
      endTime: end,
      duration: durationMinutes,
      miles: Number(distance.value),
      description: comment.value || '',
      path: [],
      exerciseType: exerciseType.value,
      userID: user.value.uid,
    })

    date.value = ''
    exerciseType.value = ''
    startTime.value = ''
    endTime.value = ''
    distance.value = ''
    comment.value = ''

    router.push({ name: 'dashboard' })
  } catch (err) {
    console.error('Error adding run:', err)
    alert('There was an error adding your run. Please try again.')
  }
}
</script>

<template>
  <div id="add-run-view" class="flex flex-col drop-shadow-xl/50">
    <h1 class="text-3xl text-center text-orange-salmon font-bold mt-32">Manually Add Session</h1>

    <h2 class="text-center text-off-white m-4">
      Input the data about your exercise session below. Rough estimates are okay.
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
          class="bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="exercise-type">Exercise Type: </label>
        <select
          v-model="exerciseType"
          id="exercise-type"
          class="bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        >
          <option disabled selected hidden value="">Select Option</option>
          <option value="Walk">Walk</option>
          <option value="Run">Run</option>
          <option value="Bike Ride">Bike Ride</option>
        </select>
      </div>

      <div class="flex flex-row items-center">
        <label for="start-time">Start Time: </label>
        <input
          v-model="startTime"
          type="time"
          id="start-time"
          class="bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="end-time">End Time: </label>
        <input
          v-model="endTime"
          type="time"
          id="end-time"
          class="bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          required
        />
      </div>

      <div class="flex flex-row items-center">
        <label for="run-distance">Distance (in miles): </label>
        <input
          v-model="distance"
          type="number"
          id="run-distance"
          class="w-1/4 bg-orange-salmon border-2 border-orange-salmon rounded-xl p-1 m-2"
          placeholder="#"
          required
        />
      </div>

      <div class="flex flex-col my-2">
        <label for="comment">Comment: </label>
        <textarea
          v-model="comment"
          placeholder="Add an optional comment about your session!"
          id="comment"
          class="border-2 border-orange-salmon rounded-xl p-2 my-2 focus:ring-2 focus:ring-off-white focus:border-off-white"
          rows="3"
        ></textarea>
      </div>

      <div class="flex flex-row justify-center">
          <motion.button
                @click="submitRun"
                  class="text-center text-orange-salmon bg-off-white rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"

                :whileHover="{ scale: 1.15, rotate: 3 }"
                :whileTap="{ scale: 0.9, rotate: -5 }"
                :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
              >
          Submit
              </motion.button>

        <RouterLink
          :to="{ name: 'dashboard' }"
          class="text-center text-orange-salmon bg-off-white rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
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
