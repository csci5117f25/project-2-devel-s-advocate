<script setup>
import { ref } from 'vue'
import { db } from '@/firebaseApp'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import DeleteComponent from './DeleteComponent.vue'
import { motion } from 'motion-v'

const props = defineProps({
  runID: { type: String, required: true },
  view: { type: String, required: true },
  description: String,
  duration: Number,
  distance: Number,
  exerciseType: String,
  startTime: Object,
  endTime: Object,
  createdAt: Object,
  hasPath: { type: Boolean, default: false },
})

const emit = defineEmits(['updated'])
const docRef = doc(db, 'runs', props.runID)

const exerciseTypes = ['Run', 'Walk', 'Bike Ride']

const isEditing = ref(false)

// editable fields
const editMiles = ref('')
const editDescription = ref('')

const editDate = ref('') // YYYY-MM-DD
const editStart = ref('') // HH:MM
const editEnd = ref('') // HH:MM
const editExerciseType = ref(props.exerciseType)

const startEditing = () => {
  isEditing.value = true
  const pad = (n) => String(n).padStart(2, '0')
  const date = props.startTime.toDate()

  editMiles.value = props.distance || 0
  editDescription.value = props.description
  editDate.value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

  editStart.value = `${pad(props.startTime.toDate().getHours())}:${pad(props.startTime.toDate().getMinutes())}`
  editEnd.value = `${pad(props.endTime.toDate().getHours())}:${pad(props.endTime.toDate().getMinutes())}`
  editExerciseType.value = props.exerciseType
}

const finishEditing = async () => {
  isEditing.value = false

  const start = new Date(`${editDate.value}T${editStart.value}`)
  const end = new Date(`${editDate.value}T${editEnd.value}`)
  const durationMinutes = Math.round((end - start) / 60000)
  if (durationMinutes < 1 && !props.hasPath) {
    alert('Your start time and end time are wrong!')
    return
  }

  // Prepare update data
  const updateData = {
    description: editDescription.value,
    exerciseType: editExerciseType.value,
    createdAt: serverTimestamp(),
  }

  // Only update distance, start time, and end time if there's no GPS path
  if (!props.hasPath) {
    updateData.miles = Number(editMiles.value)
    updateData.duration = Number(durationMinutes)
    updateData.startTime = start
    updateData.endTime = end
  }

  await updateDoc(docRef, updateData)

  emit('updated', props.runID)
}

const cancelEditing = () => {
  isEditing.value = false
}
</script>

<template>
  <div>
    <template v-if="!isEditing">
      <div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-off-white shadow-md">
        <div class="rounded-xl col-span-2 p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Timestamp: {{ props.startTime.toDate().toLocaleString() }}</span
          >
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Type: {{ props.exerciseType || 'N/A' }}
          </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Distance: {{ props.distance || 0 }} Miles</span
          >
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Duration: {{ props.duration }} Min.</span
          >
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Avg Speed: {{ (props.distance / (props.duration / 60)).toFixed(2) }} MPH</span
          >
        </div>
        <div
          v-if="props.description"
          class="rounded-xl col-span-2 p-1 text-center flex flex-col justify-center"
        >
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl"
            >Comment: {{ props.description }}
          </span>
        </div>
      </div>
      <div class="p-3 flex flex-row justify-center">
        <motion.button
          v-if="props.view == 'dashboard'"
          class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
          title="View session details"
          :whileHover="{ scale: 1.15, rotate: 3 }"
          :whileTap="{ scale: 0.9, rotate: -5 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
        >
          <router-link :to="`/view-session/${props.runID}`">
            <font-awesome-icon icon="fa-eye" />
          </router-link>
        </motion.button>
        <motion.button
          @click="startEditing"
          class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
          title="Edit session details"
          :whileHover="{ scale: 1.15, rotate: 3 }"
          :whileTap="{ scale: 0.9, rotate: -5 }"
          :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
        >
          <font-awesome-icon icon="fa-pen-to-square" />
        </motion.button>
        <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-1 rounded-xl bg-off-white shadow-md">
        <div class="md:col-span-2 rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl">
            Date: <input type="date" v-model="editDate" class="cursor-pointer" />
          </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl cursor-pointer"
            >Type:
            <select
              id="exerciseType"
              v-model="editExerciseType"
              class="border border-off-white rounded-xl px-2 cursor-pointer"
            >
              <option
                v-for="type in exerciseTypes"
                :key="type"
                :value="type"
                class="text-rosy-finch"
              >
                {{ type }}
              </option>
            </select>
          </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl">
            Distance (in miles): {{ props.hasPath ? '(GPS tracked - cannot edit)' : '' }}
            <input
              type="number"
              v-model="editMiles"
              :disabled="props.hasPath"
              class="w-1/3 border border-off-white rounded-xl px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl">
            Start Time: {{ props.hasPath ? '(GPS tracked - cannot edit)' : '' }}
            <input
              type="time"
              v-model="editStart"
              :disabled="props.hasPath"
              class="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-xl">
            End Time: {{ props.hasPath ? '(GPS tracked - cannot edit)' : '' }}
            <input
              type="time"
              v-model="editEnd"
              :disabled="props.hasPath"
              class="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </span>
        </div>

        <div class="rounded-xl md:col-span-2 p-1 text-center flex flex-col justify-center">
          <p class="text-rosy-finch">Comment:</p>
          <textarea
            class="bg-rosy-finch text-xs font-medium p-2 rounded-xl cursor-pointer"
            type="text"
            v-model="editDescription"
            rows="2"
          ></textarea>
        </div>
      </div>
      <div class="p-3 flex flex-row justify-center">
        <button
          v-if="props.view == 'dashboard'"
          class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
          title="View session details"
        >
          <router-link :to="`/view-session/${props.runID}`">
            <font-awesome-icon icon="fa-eye" />
          </router-link>
        </button>
        <button
          @click="finishEditing"
          title="Save changes"
          class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
        >
          <font-awesome-icon icon="fa-save" />
        </button>
        <button
          @click="cancelEditing"
          title="Cancel changes"
          class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
        >
          <font-awesome-icon icon="fa-x" />
        </button>
        <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Changes the icon to a light color suitable for dark backgrounds. */
input[type='date'],
input[type='time'] {
  color-scheme: dark;
}
</style>
