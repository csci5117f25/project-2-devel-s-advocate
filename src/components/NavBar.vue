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
    class="flex justify-between items-center bg-blue-950 h-24 px-5 drop-shadow-xl/25 fixed top-0 z-1000 w-full"
  >
    <RouterLink :to="{ name: 'dashboard' }" class="text-3xl text-white font-bold">
      Tr@ceRoute
    </RouterLink>

    <button v-if="user" @click="logout" class="font-bold bg-white rounded-xl px-4 py-2 button">
      <font-awesome-icon icon="fa-sign-out-alt" />
      <span class="text-blue-950">Logout</span>
    </button>

    <button v-else @click="login" class="font-bold bg-white rounded-xl px-4 py-2 button">
      <font-awesome-icon icon="fa-sign-in-alt" />
      <span class="text-blue-950">Login</span>
    </button>
  </nav>
</template>

