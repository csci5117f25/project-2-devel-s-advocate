<script setup>
import { ref, defineProps, nextTick } from 'vue';
import { useCollection } from 'vuefire';
import { db } from '@/firebaseApp';
import { collection, getDocs, where, updateDoc, query, doc } from 'firebase/firestore';

const props = defineProps({
    runID: {String, required: true}
})

console.log(props.runID)
const docRef = doc(db, 'runs', props.runID)
console.log(docRef)

// edit function 
const isEditing = ref(false);
const editText = ref("");
const editableInput = ref(null);

const startEditing = () => {
  isEditing.value = true;
  editText.value = docRef.value.description; 

  nextTick(() => {
    editableInput.value?.focus();
  });
};

const finishEditing = async () => {
    isEditing.value = false;

    if (!editText.value.trim()) return;


    await updateDoc(docRef, {
        description: editText.value
    });

    editText.value = ''

};


</script>

<template>

<button :key="props.sessionID" v-if="!isEditing" @click="startEditing">
Edit
</button>

<td v-else>
  <input
    ref="editableInput"
    v-model="editText"
    @blur="finishEditing"
    @keyup.enter="finishEditing"
  />
</td>
</template>

<style scoped>

</style>