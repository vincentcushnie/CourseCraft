<script setup>
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const { user } = storeToRefs(useAuthStore());
const { user_info } = storeToRefs(useAuthStore());
const { major_one } = storeToRefs(useAuthStore());
const { major_two } = storeToRefs(useAuthStore());

const showMoreInfo1 = ref(false);
function toggleMoreInfo1() {
  showMoreInfo1.value = !showMoreInfo1.value;
}
const showMoreInfo2 = ref(false);
function toggleMoreInfo2() {
  showMoreInfo2.value = !showMoreInfo2.value;
}
</script>

<template>
  <div v-if="user" class="mx-20 my-5">
    <h1 class="text-[#A72218] underline underline-offset-[18px] text-4xl mb-5">
      My Profile
    </h1>
    <p>
      My email: <span class="font-bold underline">{{ user.email }}</span>
    </p>
    <p>
      My name: <span class="font-bold underline">{{ user_info.name }}</span>
    </p>
    <div class="flex flex-col">
      <div>
        <span>Major 1: </span>
        <span
          v-if="user_info.major_one_id !== null"
          class="font-bold underline"
          >{{ major_one.major_name }}</span
        >
        <span v-else>No Major Set</span>
      </div>
      <div>
        <span v-if="user_info.major_two_id !== null"> Major 2: </span>
        <span
          v-if="user_info.major_two_id !== null"
          class="font-bold underline"
        >
          {{ major_two.major_name }}</span
        >
      </div>
    </div>
    <div class="flex flex-row w-full gap-2">
      <span>Major 1 Information: </span>
      <span
        v-if="user_info.major_one_id !== null"
        class="flex flex-col font-bold underline"
      >
        <div>{{ major_one.major_name }}</div>
      </span>
      <span v-if="user_info.major_one_id === null">No Major Set</span>
      <span v-if="user_info.major_one_id !== null" class="flex flex-col">
        <button
          v-if="!showMoreInfo1"
          @click="toggleMoreInfo1"
          class="text-end cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
        >
          details
        </button>
      </span>
    </div>
    <div>
      <div v-if="showMoreInfo1" class="flex flex-col">
        <div>Department: {{ major_one.department }}</div>
        <div>Major Rules: {{ major_one.rules }}</div>
        <div>Credits: {{ major_one.credits }}</div>
      </div>
      <button
        v-if="showMoreInfo1"
        @click="toggleMoreInfo1"
        class="cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
      >
        Less
      </button>
    </div>
    <div class="flex flex-row w-full gap-2">
      <span>Major 2 Information: </span>
      <span
        v-if="user_info.major_two_id !== null"
        class="flex flex-col font-bold underline"
      >
        <div>{{ major_two.major_name }}</div>
      </span>
      <span v-if="user_info.major_two_id === null">No Major Set</span>
      <span v-if="user_info.major_two_id !== null" class="flex flex-col">
        <button
          v-if="!showMoreInfo2"
          @click="toggleMoreInfo2"
          class="text-end cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
        >
          details
        </button>
      </span>
    </div>
    <div>
      <div v-if="showMoreInfo2" class="flex flex-col">
        <div>Department: {{ major_two.department }}</div>
        <div>Major Rules: {{ major_two.rules }}</div>
        <div>Credits: {{ major_two.credits }}</div>
      </div>
      <button
        v-if="showMoreInfo2"
        @click="toggleMoreInfo2"
        class="cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
      >
        Less
      </button>
    </div>
    <RouterLink :to="{ name: 'profileUpdate' }">
      <button
        @submit=""
        class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
      >
        Update
      </button>
    </RouterLink>
    <RouterLink :to="{ name: 'planner' }">
      <button
        @submit=""
        class="my-5 mx-4 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border-1 border-black"
      >
        Degree Planner
      </button>
    </RouterLink>
  </div>
</template>
