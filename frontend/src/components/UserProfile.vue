<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const { user } = storeToRefs(useAuthStore());
const { user_info } = storeToRefs(useAuthStore());
const { major_one } = storeToRefs(useAuthStore());
const { major_two } = storeToRefs(useAuthStore());
</script>

<template>
  <div v-if="user" class="greetings">
    <h1 class="green bg-sky-700">My Profile</h1>
    <p>My email: {{ user.email }}</p>
    <p>My name: {{ user_info.name }}</p>
    <div class="flex flex-col">
      <div>
        <span>Major 1:</span>
        <span v-if="user_info.major_one_id !== null">{{
          major_one.major_name
        }}</span>
        <span v-else>No Major Set</span>
      </div>
      <div>
        <span v-if="user_info.major_two_id !== null"> Major 2: </span>
        <span v-if="user_info.major_two_id !== null">
          {{ major_two.major_name }}</span
        >
      </div>
    </div>

    <RouterLink :to="{ name: 'profileUpdate' }">
      <button
        @submit=""
        class="my-5 mx-5 py-5 px-5 rounded-full bg-red-100 hover:bg-red-500 border-1 border-black"
      >
        Update
      </button>
    </RouterLink>
  </div>
</template>
