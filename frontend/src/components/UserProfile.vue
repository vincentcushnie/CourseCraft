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
  <div
    v-if="user"
    class="mx-20 my-5 bg-secondary p-4 rounded-xl px-10 font-inter text-black"
  >
    <h1
      class="text-tertiary  mt-3 underline-offset-[9px] text-4xl mb-5"
    >
      Profile
    </h1>
    <div class="flex flex-col">
      <p class="my-2 flex flex-row">
        <div class="w-25">Email: </div>
        <span class="bg-background rounded-sm px-1 grow">{{ user.email }}</span>
      </p>
      <p class="my-2 flex flex-row">
        <div class="w-25">Name: </div>
        <span class="bg-background rounded-sm px-1 grow">{{ user_info.name }}</span>
      </p>
      <div class="flex flex-row w-full justify-between my-2">
        <div class="w-full flex flex-row">
          <div class="w-25">Major 1: </div>
          <span v-if="user_info.major_one_id !== null" class="bg-background rounded-sm px-1 grow mr-3">{{
            major_one.major_name
          }}</span>
          <span v-else>No Major Set</span>
        </div>
        <span v-if="user_info.major_one_id !== null" class="flex flex-row">
          <button
            @click="toggleMoreInfo1"
            :class="[
              'cursor-pointer px-2 w-fit font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center',
              showMoreInfo1 ? 'bg-tertiary text-background' : 'bg-secondary text-tertiary hover:bg-tertiary hover:text-background'
            ]"
          >
            details
          </button>
        </span>
      </div>
      <div>
        <div v-if="showMoreInfo1" class="flex flex-col ml-15 space-y-3 my-4">
          <div class="flex flex-row w-full">
            <div class="w-30">
              Department: 
            </div><span class="bg-background rounded-sm px-1">{{ major_one.department }}</span></div>
          <div class="flex flex-row">
            <div class="w-30 shrink-0 self-start">
              Major Rules: 
            </div>
            <span class="bg-background rounded-sm px-1">{{ major_one.rules }}</span>
          </div>
          <div class="flex flex-row">
            <div class="w-30">
              Credits: 
            </div><span class="bg-background rounded-sm px-1">{{ major_one.credits }}</span></div>
        </div>
        <!-- <button
          v-if="showMoreInfo1"
          @click="toggleMoreInfo1"
          class="cursor-pointer px-2 bg-secondary w-fit text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center hover:bg-tertiary hover:text-secondary"
        >
          Less
        </button> -->
      </div>
      <div class="flex flex-row w-full justify-between">
        <div class="flex flex-row w-full">
          <div v-if="user_info.major_two_id !== null" class="w-25"> Major 2: </div>
          <span v-if="user_info.major_two_id !== null" class="bg-background rounded-sm px-1 grow mr-3">
            {{ major_two.major_name }}</span
          >
          <span v-else>Major 2: No Major Set</span>
        </div>
        <span v-if="user_info.major_two_id !== null" class="flex flex-col">
          <button
            @click="toggleMoreInfo2"
            :class="[
              'cursor-pointer px-2 w-fit font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center',
              showMoreInfo2 ? 'bg-tertiary text-background' : 'bg-secondary text-tertiary hover:bg-tertiary hover:text-background'
            ]"          >
            details
          </button>
        </span>
      </div>
      <div>
         <div v-if="showMoreInfo2" class="flex flex-col ml-15 space-y-3 my-4">
          <div class="flex flex-row w-full">
            <div class="w-30">
              Department: 
            </div><span class="bg-background rounded-sm px-1">{{ major_two.department }}</span></div>
          <div class="flex flex-row">
            <div class="w-30 shrink-0 self-start">
              Major Rules: 
            </div>
            <span class="bg-background rounded-sm px-1">{{ major_two.rules }}</span>
          </div>
          <div class="flex flex-row">
            <div class="w-30">
              Credits: 
            </div><span class="bg-background rounded-sm px-1">{{ major_two.credits }}</span></div>
        </div>
        <!-- <button
          v-if="showMoreInfo2"
          @click="toggleMoreInfo2"
          class="cursor-pointer px-2 bg-secondary w-fit text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center hover:bg-tertiary hover:text-secondary"
        >
          Less
        </button> -->
      </div>
    </div>
    <RouterLink :to="{ name: 'profileUpdate' }">
      <button
        @submit=""
        class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 bg-secondary hover:bg-tertiary hover:text-background border-2 border-tertiary text-tertiary rounded-lg"
      >
        Update Profile
      </button>
    </RouterLink>
    <RouterLink :to="{ name: 'planner' }">
      <button
        @submit=""
        class="my-5 mx-4 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-secondary text-tertiary border-2 border-tertiary hover:text-background hover:border-tertiary hover:bg-tertiary"
      >
        Degree Planner
      </button>
    </RouterLink>
  </div>
</template>
