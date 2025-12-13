<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { db } from '@/firebaseApp'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { motion } from 'motion-v'

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

function goToDashboard() {
  router.push({ name: 'dashboard' })
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
      <div id="form-input-container">
        <div class="flex flex-row items-center">
          <motion.label
            for="run-date"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >Date:
          </motion.label>
          <motion.input
            v-model="date"
            type="date"
            id="run-date"
            class="bg-orange-salmon hover:bg-light-orange-salmon border-2 border-orange-salmon focus:ring-2 focus:ring-off-white focus:border-off-white rounded-xl p-1 my-2 mx-3 cursor-pointer"
            :whileFocus="{ scale: 1.1, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          />
        </div>

        <div class="flex flex-row items-center">
          <motion.label
            for="exercise-type"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >Exercise Type:
          </motion.label>
          <motion.select
            v-model="exerciseType"
            id="exercise-type"
            class="bg-orange-salmon hover:bg-light-orange-salmon border-2 border-orange-salmon focus:ring-off-white focus:border-off-white rounded-xl p-1 my-2 mx-3 cursor-pointer"
            :whileFocus="{ scale: 1.1, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          >
            <option disabled selected hidden value="">Select Option</option>
            <option value="Walk">Walk</option>
            <option value="Run">Run</option>
            <option value="Bike Ride">Bike Ride</option>
          </motion.select>
        </div>

        <div class="flex flex-row items-center">
          <motion.label
            for="start-time"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >Start Time:
          </motion.label>
          <motion.input
            v-model="startTime"
            type="time"
            id="start-time"
            class="bg-orange-salmon hover:bg-light-orange-salmon border-2 border-orange-salmon focus:ring-2 focus:ring-off-white focus:border-off-white rounded-xl p-1 my-2 mx-3 cursor-pointer"
            :whileFocus="{ scale: 1.1, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          />
        </div>

        <div class="flex flex-row items-center">
          <motion.label
            for="end-time"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >End Time:
          </motion.label>
          <motion.input
            v-model="endTime"
            type="time"
            id="end-time"
            class="bg-orange-salmon hover:bg-light-orange-salmon border-2 border-orange-salmon focus:ring-2 focus:ring-off-white focus:border-off-white rounded-xl p-1 my-2 mx-3 cursor-pointer"
            :whileFocus="{ scale: 1.1, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          />
        </div>

        <div class="flex flex-row items-center">
          <motion.label
            for="run-distance"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >Distance (in miles):
          </motion.label>
          <motion.input
            v-model="distance"
            type="number"
            id="run-distance"
            placeholder="#"
            class="w-1/4 bg-orange-salmon hover:bg-light-orange-salmon border-2 border-orange-salmon focus:ring-2 focus:ring-off-white focus:border-off-white rounded-xl p-1 my-2 mx-3 cursor-pointer"
            :whileFocus="{ scale: 1.1, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          />
        </div>

        <div class="flex flex-col my-2">
          <motion.label
            for="comment"
            :initial="{ opacity: 0, y: -80 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.8 }"
            >Comment:
          </motion.label>
          <motion.textarea
            v-model="comment"
            placeholder="Add an optional comment about your session!"
            id="comment"
            class="border-2 border-orange-salmon focus:ring-2 focus:ring-off-white focus:border-off-white rounded-xl p-2 my-2 mx-1 cursor-pointer"
            :whileFocus="{ scale: 1.01, borderColor: 'rgb(31, 141, 214)' }"
            :transition="{ type: 'spring', stiffness: 300 }"
            required
          />
        </div>
      </div>

      <div id="form-buttons">
        <div class="flex flex-row justify-center">
          <motion.button
            @click="submitRun"
            class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
            :whileHover="{ scale: 1.15, rotate: 3 }"
            :whileTap="{ scale: 0.9, rotate: -5 }"
            :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
          >
            Submit
          </motion.button>

          <motion.button
            @click="goToDashboard"
            class="text-center text-orange-salmon bg-off-white active:bg-lightgray rounded-xl px-4 py-2 mx-4 my-2 cursor-pointer"
            :whileHover="{ scale: 1.15, rotate: 3 }"
            :whileTap="{ scale: 0.9, rotate: -5 }"
            :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
          >
            Cancel
          </motion.button>
        </div>
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
