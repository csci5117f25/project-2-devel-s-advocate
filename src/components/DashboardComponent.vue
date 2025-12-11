<script setup>
import EditComponent from './EditComponent.vue'

const props = defineProps({
  runID: { type: String, required: true },

  description: String,
  duration: Number,
  distance: Number,
  exerciseType: String,

  startTime: Object,
  endTime: Object,    
  createdAt: Object   
})





</script>

<template>
<EditComponent
  :runID="props.runID"
  :description="props.description"
  :distance="props.distance"
  :duration="props.duration"
  :startTime="props.startTime"
  :endTime="props.endTime"
  :exerciseType="props.exerciseType"
  :createdAt="props.createdAt"
/>
</template>
