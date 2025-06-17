<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="bg-background h-screen flex flex-col">
    <header class="w-full flex flex-col justify-center">
      <!-- <RouterLink
      :to="{ name: 'home' }"
      class="text-5xl bg-error text-white rounded-xl mx-20 my-8"
      >Home</RouterLink
    > -->
      <RouterView name="header" />
    </header>

    <main class="bg-background">
      <div class="mb-10">
        <RouterView name="default" />
      </div>
    </main>
    <RouterView name="footer" />
  </div>
</template>
