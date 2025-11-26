<script setup>
import {ref, emit} from 'vue';
const emit = defineEmits(["toggle", "updated"]);

const firestoreTodo = ref("");
const firestoreCategory = ref(""); 
const toggleDone = () => {
  emit("toggle", props.sessionID);
};

const deleteTodo = async () => {
  const todosRef = collection(db, "todos");

  const q = query(todosRef, where("sessionID", "==", props.sessionID));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];  
    const docID = docSnap.id;               
    const ref = doc(db, "todos", docID);
    const docData = docSnap.data();

    firestoreTodo.value = docData.todo_item;
    firestoreCategory.value = docData.category;
    await deleteDoc(ref);
    emit("deleted", props.sessionID);
    console.log("Todo updated!");
  } else {
    console.warn("No todo found with sessionID:", props.sessionID);
  }
};


</script>

<template>


</template>

<style scoped>

</style>