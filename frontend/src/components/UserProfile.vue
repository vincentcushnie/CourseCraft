<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const { user } = storeToRefs(useAuthStore());
const { user_info } = storeToRefs(useAuthStore());
</script>

<template>
  <div></div>
  <div class="greetings">
    <h1 class="green bg-sky-700">My Profile</h1>
    <p>My email: {{ user_info.name }}</p>
    <p>My name: {{ user.email }}</p>
    <p>
      Major 1:
      <span v-if="user_info.major_one_id !== null">{{
        user_info.major_one_id
      }}</span>
      <span v-else>No Major Set</span>
      <span v-if="user_info.major_two_id !== null">
        {{ user_info.major_two_id }}</span
      >
    </p>
    <button
      @submit=""
      class="my-5 mx-5 py-5 px-5 rounded-full bg-red-100 hover:bg-red-500 border-1 border-black"
    >
      Update
    </button>
  </div>
</template>
