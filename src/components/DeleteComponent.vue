<script setup>
import { db } from '@/firebaseApp'
import { deleteDoc, doc } from 'firebase/firestore'
import { motion, AnimatePresence, useScroll, animate } from 'motion-v'

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
  <motion.button
    class="bg-off-white active:bg-lightgray text-orange-salmon rounded-xl px-4 py-2 mx-2 cursor-pointer"
    @click="deleteRun"
    title="Delete session"
    :whileHover="{ scale: 1.15, rotate: 3 }"
    :whileTap="{ scale: 0.9, rotate: -5 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
  >
    <font-awesome-icon icon="fa-trash-can" />
  </motion.button>
</template>
