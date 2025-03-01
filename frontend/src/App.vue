<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="bg-[#E9E7E0] h-screen w-screen">
    <header class="w-full flex flex-col justify-center">
      <!-- <RouterLink
      :to="{ name: 'home' }"
      class="text-5xl bg-[#500000] text-white rounded-xl mx-20 my-8"
      >Home</RouterLink
    > -->
      <RouterView name="header" />
    </header>

    <main>
      <RouterView name="default" />
    </main>
    <RouterView name="footer" />
  </div>
</template>
