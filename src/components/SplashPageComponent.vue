<script setup lang="ts">
import { ref } from 'vue'
import { useLoop, useLoader } from '@tresjs/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Sparkles } from '@tresjs/cientos'

const modelRef = ref()

const { state: model } = useLoader(GLTFLoader, 'src/assets/images/P2-Logo 3 tr.png')
const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  if (modelRef.value) {
    const scale = 1 + Math.sin(elapsed * 2) * 0.7
    modelRef.value.scale.set(scale, scale, scale)
    modelRef.value.rotation.x = elapsed * 0.2
    modelRef.value.rotation.y = elapsed * 0.3
    modelRef.value.position.y = Math.sin(elapsed * 2) * 0.9
  }
})
</script>


<template>
  <TresPerspectiveCamera
    :position="[4, 4, 4]"
    :look-at="[0, 0, 0]"
  />

  <primitive
    v-if="model?.scene"
    ref="modelRef"
    :object="model.scene"
  />
  <TresAmbientLight :intensity="1" />
</template>

