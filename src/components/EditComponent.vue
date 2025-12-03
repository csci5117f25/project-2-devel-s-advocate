<script setup>
import { ref, defineProps, nextTick, defineEmits } from 'vue'
import { db } from '@/firebaseApp'
import { updateDoc, doc } from 'firebase/firestore'

const props = defineProps({
  runID: { String, required: true },
  description: { String, required: false },
})

const emit = defineEmits(['updated'])
const docRef = doc(db, 'runs', props.runID)

// edit function
const isEditing = ref(false)
const editText = ref('')
const editableInput = ref(null)

const startEditing = () => {
  isEditing.value = true

  editText.value = props.description

  nextTick(() => {
    editableInput.value?.focus()
  })
}
//save
const finishEditing = async () => {
  isEditing.value = false

  if (!editText.value.trim()) return

  await updateDoc(docRef, {
    description: editText.value,
  })

  emit('updated', props.runID)
  console.log('description updated:', editText.value)
  editText.value = ''
}

//cancel function 
const cancelEditing = () => {
  isEditing.value = false;
  editText.value = "";
};
</script>

<template>
  <div class="flex items-center gap-3">
    <template v-if="!isEditing">
      <span class="flex-1 text-gray-800">
        {{ props.description }}
      </span>

      <button
        @click="startEditing"
        class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl 
         shadow-sm hover:bg-indigo-700 active:bg-indigo-800 
         transition-all"
      >
        Edit
      </button>
    </template>

    <template v-else>
      <input
        ref="editableInput"
        v-model="editText"
        @keyup.enter="finishEditing"
      />

      <button
      class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl 
         shadow-sm hover:bg-indigo-700 active:bg-indigo-800 
         transition-all"
        @click="finishEditing"
      >
        Save
      </button>

      <button
        @click="cancelEditing"
        class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl 
         shadow-sm hover:bg-indigo-700 active:bg-indigo-800 
         transition-all"
      >
        Cancel
      </button>
    </template>
  </div>
</template>
