<script setup>
import { defineEmits } from 'vue'

import { db } from '@/firebaseApp'
import { deleteDoc, doc } from 'firebase/firestore'

import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  runID: { String, required: true },
})

const emit = defineEmits(['deleted'])


const deleteRun = async () => {
  const ref = doc(db, 'runs', props.runID)
  await deleteDoc(ref)
  emit('deleted', props.runID)
  console.log('Todo delete!')
  router.push('/dashboard')
}
</script>

<template>
  <button class="mt-2 pl-2 pr-2 bg-purple-600 text-white font-small py-2 rounded-xl 
         shadow-sm hover:bg-indigo-700 active:bg-indigo-800 
         transition-all" @click="deleteRun">Delete Run</button>
</template>
