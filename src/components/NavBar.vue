<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const router = useRouter()
const user = useCurrentUser()

const login = async () => {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
  router.push({ name: 'dashboard' })
}

const logout = async () => {
  const auth = getAuth()
  await auth.signOut()
  router.push({ name: 'splashPage' })
}
</script>

<template>
  <nav
    class="flex justify-between items-center bg-white h-24 px-5 drop-shadow-xl/25 fixed top-0 z-1000 w-full"
  >
    <RouterLink :to="{ name: 'dashboard' }">
      <img src="../assets/images/traceroute_logo.png" alt="tr@ceroute" />
    </RouterLink>

    <button
      v-if="user"
      @click="logout"
      class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer"
    >
      <font-awesome-icon icon="fa-sign-out-alt" /><slot class="text-blue-950"> Logout</slot>
    </button>
    <button
      v-else
      @click="login"
      class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer"
    >
      <font-awesome-icon icon="fa-sign-in-alt" /><slot class="text-blue-950"> Login</slot>
    </button>
  </nav>
</template>

<style scoped>
img {
  height: 75px;
}
</style>
