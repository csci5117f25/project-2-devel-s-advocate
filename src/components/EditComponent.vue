<script setup>
import { ref, defineProps, nextTick, defineEmits } from 'vue'
import { db } from '@/firebaseApp'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'

const props = defineProps({
  runID: { type: String, required: true },

  description: String,
  duration: Number,
  distance: Number,

  startTime: Object,
  endTime: Object,    
  createdAt: Object   
})

const emit = defineEmits(['updated'])
const docRef = doc(db, 'runs', props.runID)

const isEditing = ref(false)

// editable fields
const editMiles = ref('')
const editDescription = ref('')

const editDate = ref('')    // YYYY-MM-DD
const editStart = ref('')   // HH:MM
const editEnd = ref('')     // HH:MM

const startEditing = () => {
  isEditing.value = true

  editMiles.value = props.distance
  editDescription.value = props.description

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
      <p><strong>Date:</strong> {{ props.startTime.toDate().toLocaleString() }}</p>
      <p><strong>Distance:</strong> {{ props.distance }} miles</p>
      <p><strong>Duration:</strong> {{ props.duration }} min</p>
      <p><strong>Comment:</strong> {{ props.description }}</p>

      <button @click="startEditing" class="bg-orange-salmon rounded-xl px-4 py-2">
        Edit
      </button>
    </template>

    <template v-else>
      <p><strong>Date:</strong>
        <input type="date" v-model="editDate" class="bg-orange-salmon rounded-xl p-1" />
      </p>

      <p><strong>Start Time:</strong>
        <input type="time" v-model="editStart" class="bg-orange-salmon rounded-xl p-1" />
      </p>

      <p><strong>End Time:</strong>
        <input type="time" v-model="editEnd" class="bg-orange-salmon rounded-xl p-1" />
      </p>

      <p><strong>Distance:</strong>
        <input v-model="editMiles" /> miles
      </p>

      <p><strong>Duration:</strong>
        {{ props.duration }} minutes
      </p>

      <p><strong>Comment:</strong>
        <input v-model="editDescription" />
      </p>

      <button @click="finishEditing" class="bg-orange-salmon rounded-xl px-4 py-2">
        Save
      </button>
      <button @click="cancelEditing" class="bg-orange-salmon rounded-xl px-4 py-2">
        Cancel
      </button>
    </template>
  </div>
</template>
