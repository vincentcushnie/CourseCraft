<script setup>
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
const authStore = useAuthStore();
</script>

<template>
  <h1 class="text-3xl bg-[#Eb6F46] text-white text-center py-16 w-full">
    <RouterLink :to="{ name: 'home' }" class="text-5xl text-[#E9E7E0]"
      >Title</RouterLink
    >
  </h1>
  <nav class="py-2 px-4 w-full flex flex-row-reverse bg-[#E3C5B2]">
    <div v-if="authStore.user" class="flex flex-row">
      <div class="px-2 text-[#A72218]">
        Welcome back {{ authStore.user.name }}
      </div>
      <div class="mx-2 text-[#A72218] hover:underline">
        <RouterLink :to="{ name: 'create' }">New Post</RouterLink>
      </div>
      <form
        @submit.prevent="authStore.logout"
        class="px-2 text-[#A72218] border-l-1 border-[#A72218]"
      >
        <button class="hover:underline">Logout</button>
      </form>
    </div>
    <div v-else class="flex flex-row">
      <div
        class="px-2 text-[#A72218] border-r-1 border-[#A72218] hover:underline"
      >
        <RouterLink :to="{ name: 'login' }">Login</RouterLink>
      </div>
      <div class="mx-2 text-[#A72218] hover:underline">
        <RouterLink :to="{ name: 'register' }">Register</RouterLink>
      </div>
    </div>
  </nav>
</template>
