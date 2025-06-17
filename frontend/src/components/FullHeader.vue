<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const lastSegment = computed(() => route.path.split("/").filter(Boolean).pop());
const authStore = useAuthStore();
const { user, user_info } = storeToRefs(authStore);
const handleLogout = () => {
  authStore.logout();
  //any other store clearing
};

const options = ["profile", "planner"];
const selected = ref(lastSegment);
</script>

<template>
  <h1
    class="text-3xl bg-primary text-white text-center py-16 w-full font-inter"
  >
    <RouterLink :to="{ name: 'home' }" class="text-5xl text-background"
      >Course Craft</RouterLink
    >
  </h1>
  <nav class="py-2 px-4 w-full flex flex-row-reverse bg-secondary">
    <div v-if="user && user_info" class="flex flex-row w-full">
      <div
        class="px-2 text-tertiary grow font-inter flex flex-row items-center text-left"
      >
        User:&nbsp;
        <span v-if="user_info.name" class="font-bold">
          {{ user_info.name }}
        </span>
      </div>
      <div
        class="flex flex-row border-primary bg-primary border-1 rounded-md py-1 px-1 space-x-3"
      >
        <RouterLink
          v-for="option in options"
          :key="option"
          :to="{ name: option }"
          :class="[
            'text-tertiary  font-inter rounded-md p-1 w-25 text-center inline-block',
            selected === option
              ? 'bg-tertiary text-white'
              : 'bg-secondary text-black',
          ]"
          @click="selected = option"
        >
          {{ option }}
        </RouterLink>
      </div>
      <form
        @submit.prevent="handleLogout"
        class="px-2 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-4 my-1 hover:bg-tertiary hover:text-background"
      >
        <button class="">Logout</button>
      </form>
    </div>
    <div v-else class="flex flex-row">
      <div
        class="px-2 text-tertiary font-inter border-2 border-tertiary rounded-l-lg border-r-0 text-center flex flex-col justify-center my-1 hover:bg-tertiary hover:text-background"
      >
        <RouterLink :to="{ name: 'login' }">Login</RouterLink>
      </div>
      <div
        class="px-2 text-tertiary font-inter border-2 border-tertiary rounded-r-lg text-center flex flex-col justify-center my-1 hover:bg-tertiary hover:text-background"
      >
        <RouterLink :to="{ name: 'register' }">Register</RouterLink>
      </div>
    </div>
  </nav>
</template>
