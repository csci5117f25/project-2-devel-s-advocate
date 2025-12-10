<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

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

    <!-- Hamburger menu -->
    <button class="flex items-center" @click="toggleMenu">
      <font-awesome-icon
        :icon="menuOpen ? 'fa-times' : 'fa-bars'"
        class="text-3xl text-orange-salmon cursor-pointer"
      />
    </button>
  </nav>

  <!-- Menu div -->
  <div
    v-if="menuOpen"
    class="bg-off-white drop-shadow-xl rounded-bl-xl px-5 py-4 fixed top-24 right-0 z-50 flex flex-col space-y-4"
  >
    <template v-if="user">
      <RouterLink
        :to="{ name: 'startRun' }"
        class="px-4 py-2 cursor-pointer text-right text-2xl text-orange-salmon"
        ><font-awesome-icon icon="fa-play" /> Start Session
      </RouterLink>

      <RouterLink
        :to="{ name: 'addRun' }"
        class="px-4 py-2 cursor-pointer text-right text-2xl text-orange-salmon"
        ><font-awesome-icon icon="fa-plus" /> Add Session
      </RouterLink>

      <button
        @click="logout"
        class="px-4 py-2 cursor-pointer text-right text-2xl text-orange-salmon"
      >
        <font-awesome-icon icon="fa-sign-out-alt" /> Logout
      </button>
    </template>

    <template v-else>
      <button
        @click="login"
        class="px-4 py-2 cursor-pointer text-right text-2xl text-orange-salmon"
      >
        <font-awesome-icon icon="fa-sign-in-alt" /> Login
      </button>
    </template>
  </div>
</template>

<style scoped>
img {
  height: 75px;
}
</style>
