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
    class="flex justify-between items-center bg-off-white h-24 px-5 drop-shadow-xl/25 fixed top-0 z-1000 w-full"
  >
    <RouterLink :to="{ name: 'dashboard' }">
      <img src="../assets/images/traceroute_logo.png" alt="tr@ceroute" />
    </RouterLink>

    <template v-if="user">
      <div class="flex flex-row">
        <RouterLink
          :to="{ name: 'startRun' }"
          class="border border-black font-bold bg-off-white rounded-xl px-4 py-2"
        >
          <font-awesome-icon icon="fa-play" /> Start
        </RouterLink>

        <RouterLink
          :to="{ name: 'addRun' }"
          class="border border-black font-bold bg-off-white rounded-xl px-4 py-2"
        >
          <font-awesome-icon icon="fa-plus" /> Add
        </RouterLink>

        <button
          @click="logout"
          class="border border-black font-bold bg-off-white rounded-xl px-4 py-2 cursor-pointer"
        >
          <font-awesome-icon icon="fa-sign-out-alt" /> Logout
        </button>
      </div>
    </template>

    <template v-else>
      <button
        @click="login"
        class="border border-black font-bold bg-off-white rounded-xl px-4 py-2 cursor-pointer"
      >
        <font-awesome-icon icon="fa-sign-in-alt" /> Login
      </button>
    </template>
  </nav>
</template>

<style scoped>
img {
  height: 75px;
}
</style>
