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
  const isConfirmed = confirm(
    `Are you sure you want to delete this exercise session from your account?`,
  )
  if (isConfirmed) {
    const ref = doc(db, 'runs', props.runID)
    await deleteDoc(ref)
    emit('deleted', props.runID)
    router.push('/dashboard')
  } else {
    alert('Action cancelled.')
  }
}
</script>

<template>
  <button
    class="bg-off-white text-orange-salmon rounded-xl px-4 py-2 mx-2 hover:bg-lightgray cursor-pointer"
    @click="deleteRun"
    title="Delete session"
  >
    <font-awesome-icon icon="fa-trash-can" />
  </button>
</template>
