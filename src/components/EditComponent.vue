<script setup>
import { ref, defineProps, nextTick, defineEmits } from 'vue'
import { db } from '@/firebaseApp'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import DeleteComponent from './DeleteComponent.vue'

const props = defineProps({
  runID: { type: String, required: true },

  description: String,
  duration: Number,
  distance: Number,

  startTime: Object,
  endTime: Object,
  createdAt: Object,
})

const emit = defineEmits(['updated'])
const docRef = doc(db, 'runs', props.runID)

const isEditing = ref(false)

// editable fields
const editMiles = ref('')
const editDescription = ref('')

const editDate = ref('') // YYYY-MM-DD
const editStart = ref('') // HH:MM
const editEnd = ref('') // HH:MM

const startEditing = () => {
  isEditing.value = true

  editMiles.value = props.distance
  editDescription.value = props.description
  editDate.value = props.startTime.toDate().toISOString().slice(0, 10)
  editStart.value = props.startTime.toDate().toISOString().slice(11, 16)
  editEnd.value = props.endTime.toDate().toISOString().slice(11, 16)
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-3xl shadow-md">
        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Date:</strong>
          <div>{{ props.startTime.toDate().toLocaleString() }}</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Start Time:</strong>
          <div>{{ props.startTime.toDate().toLocaleTimeString() }}</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Exercise Type:</strong>
          <div>Run</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Distance:</strong>
          <div>{{ props.distance }} miles</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Duration:</strong>
          <div>{{ props.duration }} min</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Average Speed:</strong>
          <div>{{ (props.distance / (props.duration / 60)).toFixed(2) }} mph</div>
        </div>
      </div>
      <button @click="startEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Edit</button>
      <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
      <button class="bg-orange-salmon rounded-xl px-4 py-2">
        <router-link :to="`/completed-run/${props.runID}`"> View </router-link>
      </button>
    </template>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-3xl shadow-md">
        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Date:</strong>
          <input type="date" v-model="editDate" class="bg-orange-salmon rounded-xl p-2 w-full" />
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Distance:</strong>
          <input v-model="editMiles" class="bg-orange-salmon rounded-xl p-2 w-full" /> miles
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Start Time:</strong>
          <input type="time" v-model="editStart" class="bg-orange-salmon rounded-xl p-2 w-full" />
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>End Time:</strong>
          <input type="time" v-model="editEnd" class="bg-orange-salmon rounded-xl p-2 w-full" />
        </div>



        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Duration:</strong>
          <div>{{ props.duration }} minutes</div>
        </div>

        <div class="border border-gray-400 rounded-xl p-3 text-center flex flex-col justify-center">
          <strong>Comment:</strong>
          <input v-model="editDescription" class="bg-orange-salmon rounded-xl p-2 w-full" />
        </div>
      </div>

      <button @click="finishEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Save</button>
      <button @click="cancelEditing" class="bg-orange-salmon rounded-xl px-4 py-2">Cancel</button>
      <DeleteComponent :runID="`${props.runID}`"></DeleteComponent>
      <button class="bg-orange-salmon rounded-xl px-4 py-2">
        <router-link :to="`/completed-run/${props.runID}`"> View </router-link>
      </button>
    </template>
  </div>
</template>
