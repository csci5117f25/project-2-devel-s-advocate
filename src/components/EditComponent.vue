<script setup>
import { ref, defineProps, nextTick, defineEmits } from 'vue';
import { useCollection } from 'vuefire';
import { db } from '@/firebaseApp';
import {  updateDoc, doc } from 'firebase/firestore';

const props = defineProps({
  runID: { String, required: true }, 
    description: {String, required: false}
})



const emit = defineEmits(["updated"]);
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
    emit("updated", props.sessionID);
  console.log("Todo updated:", editText.value);

};



</script>

<template>

<button :key="props.sessionID" v-if="!isEditing" @click="startEditing">
{{ props.description }}
</button>

<p v-else>
  <input
    ref="editableInput"
    v-model="editText"
    @blur="finishEditing"
    @keyup.enter="finishEditing"
  />
</p>
</template>

<style scoped>

</style>