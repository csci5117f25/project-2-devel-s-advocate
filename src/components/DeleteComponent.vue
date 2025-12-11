<script setup>
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
  console.log('run delete!')
  router.push('/dashboard')
}
</script>

<template>
  <button class="bg-orange-salmon rounded-xl px-4 py-2" @click="deleteRun">Delete</button>
</template>
