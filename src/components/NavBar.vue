<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCurrentUser } from 'vuefire'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref } from 'vue'

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

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

    <div class="hidden md:flex space-x-4 items-center">

        <RouterLink :to="{ name: 'addRun' }">
          Add Run
    </RouterLink>

        <RouterLink :to="{ name: 'startRun' }">
          Start Run
    </RouterLink>
          <button
        v-if="user"
        @click="logout"
        class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer"
      >
        <font-awesome-icon icon="fa-sign-out-alt" />
        <span class="text-blue-950">Logout</span>
      </button>

      <button
        v-else
        @click="login"
        class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer"
      >
        <font-awesome-icon icon="fa-sign-in-alt" />
        <span class="text-blue-950">Login</span>
      </button>
    </div>

      <!-- Hamburger menu-->
    <button
      class="md:hidden flex items-center"
      @click="toggleMenu"
    >
      <font-awesome-icon
        :icon="menuOpen ? 'fa-times' : 'fa-bars'"
        class="text-2xl"
      />
    </button>
  </nav>



  <!-- menu div -->
  <div
    v-if="menuOpen"
    class="md:hidden bg-white w-full drop-shadow-xl px-5 py-4 fixed top-24 z-50 flex flex-col space-y-4"
  >
    <button
      v-if="user"
      @click="logout"
      class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer text-left"
    >
      <font-awesome-icon icon="fa-sign-out-alt" />
      <span class="ml-2 text-blue-950">Logout</span>
    </button>

    <button
      v-else
      @click="login"
      class="border border-black font-bold bg-white rounded-xl px-4 py-2 cursor-pointer text-left"
    >
      <font-awesome-icon icon="fa-sign-in-alt" />
      <span class="ml-2 text-blue-950">Login</span>
    </button>

        <RouterLink :to="{ name: 'addRun' }">
          Add Run
    </RouterLink>

        <RouterLink :to="{ name: 'startRun' }">
          Start Run
    </RouterLink>
  </div>
</template>

<style scoped>
img {
  height: 75px;
}

</style>
