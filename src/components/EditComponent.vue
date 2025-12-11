<script setup>
import { ref, defineProps, defineEmits, watch} from 'vue'
import { db } from '@/firebaseApp'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import DeleteComponent from './DeleteComponent.vue'

const props = defineProps({
  runID: { type: String, required: true },

  description: String,
  duration: Number,
  distance: Number,
  exerciseType: String,
  startTime: Object,
  endTime: Object,
  createdAt: Object,
})

const emit = defineEmits(['updated'])
const docRef = doc(db, 'runs', props.runID)

const exerciseTypes = [
  "type-run", 
  "type-walk", 
  "type-bike"
]

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
  editMiles.value = props.distance
  editDescription.value = props.description
  editDate.value = props.startTime.toDate().toISOString().slice(0, 10)
editStart.value = `${pad(props.startTime.toDate().getHours())}:${pad(props.startTime.toDate().getMinutes())}`
editEnd.value = `${pad(props.endTime.toDate().getHours())}:${pad(props.endTime.toDate().getMinutes())}`
  editExerciseType.value = props.exerciseType
}

const finishEditing = async () => {
  isEditing.value = false

  const start = new Date(`${editDate.value}T${editStart.value}`)
  const end = new Date(`${editDate.value}T${editEnd.value}`)
  const durationMinutes = Math.round((end - start) / 60000)
  if (durationMinutes < 1) {
    alert('Your start time and end time is wrong!')
    return
  }

  await updateDoc(docRef, {
    miles: Number(editMiles.value),
    duration: Number(durationMinutes),
    description: editDescription.value,
    exerciseType: editExerciseType.value,
    startTime: start,
    endTime: end,
    createdAt: serverTimestamp(),
  })

  emit('updated', props.runID)
}

const cancelEditing = () => {
  isEditing.value = false
}
</script>

<template>
  <div>
    <template v-if="!isEditing">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-1 p-1 rounded-3xl shadow-md">
        <div class="rounded-full p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full">{{
            props.startTime.toDate().toLocaleDateString()
          }}</span>
        </div>

        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
            >Start Time: {{ props.startTime.toDate().toLocaleTimeString() }}</span
          >
        </div>

        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
            >Exercise Type: {{ props.exerciseType }}
          </span>
        </div>

        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
            >Distance: {{ props.distance }} Miles</span
          >
        </div>

        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
            >Duration: {{ props.duration }} min</span
          >
        </div>

        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
            >Average Speed: {{ (props.distance / (props.duration / 60)).toFixed(2) }} mph</span
          >
        </div>
      </div>
      <button @click="startEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Edit</button>
      <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
      <button class="bg-orange-salmon rounded-xl px-4 py-2">
        <router-link :to="`/completed-run/${props.runID}`"> View </router-link>
      </button>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-1 rounded-3xl shadow-md">
        <div class="rounded-xl p-3 text-center flex flex-col justify-center">
          <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full">
          <input type="date" v-model="editDate" />
</span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <input class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full" v-model="editMiles" /> 
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
<span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full">
          <input type="time" v-model="editStart" />  Start Time </span>
        </div>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
  <span class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full">
          <input type="time" v-model="editEnd" />  End Time </span>
        </div>

  <select
    id="exerciseType"
    v-model="editExerciseType"
class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full"
  >
    <option v-for="type in exerciseTypes" :key="type" :value="type">
      {{ type }}
    </option>
  </select>

        <div class="rounded-xl p-1 text-center flex flex-col justify-center">
          <input class="bg-rosy-finch text-xs font-medium px-1.5 py-1.5 rounded-full" type="text" v-model="editDescription" />
        </div>
      </div>

      <button @click="finishEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Save</button>
      <button @click="cancelEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Cancel</button>
      <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
    </template>
  </div>
</template>
