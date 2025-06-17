<script setup>
import { onMounted, reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const { user } = storeToRefs(useAuthStore());
const { user_info } = storeToRefs(useAuthStore());
const { major_one } = storeToRefs(useAuthStore());
const { major_two } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(useAuthStore());
const { update } = useAuthStore();
const majors = ref([]);
const loading = ref(true);

const formData = reactive({
  name: user_info.value?.name || "",
  major_one_id: user_info.value?.major_one_id || null,
  major_two_id: user_info.value?.major_two_id || null,
});

onMounted(async () => {
  errors.value = {};
  const res = await fetch(`/api/majors`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  if (data.errors) {
  } else {
    majors.value = data;
  }
  loading.value = false;
});

const updateFunc = async (formData) => {
  await update(formData);
};
</script>

<template>
  <div class="mx-20 my-5 bg-secondary rounded-xl pt-5 font-inter" v-if="user">
    <h1 class="text-tertiary text-4xl mb-8 text-center">Edit Profile</h1>
    <form
      @submit.prevent="updateFunc(formData)"
      class="w-1/2 mx-auto space-y-6"
    >
      <div v-if="true" class="flex flex-row w-full">
        <p class="w-[120px]">Name:</p>
        <input
          type="text"
          :placeholder="formData.name"
          v-model="formData.name"
          class="grow p-1 bg-background rounded-sm focus:outline-none focus:ring-0"
        />
        <p v-if="errors.name" class="text-error">{{ errors.name[0] }}</p>
      </div>

      <div class="flex flex-row w-full">
        <p class="w-[120px]">Major One:</p>
        <div class="grow flex flex-row bg-background rounded-sm">
          <div v-if="loading">Loading...</div>
          <select class="grow p-1 font-inter" v-model="formData.major_one_id">
            <option :value="null">None</option>
            <option v-for="major in majors" :key="major.id" :value="major.id">
              {{ major.major_name }}
            </option>
          </select>
        </div>
        <p v-if="errors.major_one_id" class="text-error">
          {{ errors.major_one_id[0] }}
        </p>
      </div>
      <div class="flex flex-row w-full">
        <p class="w-[120px]">Major Two:</p>
        <div class="grow flex flex-row bg-background rounded-sm">
          <div v-if="loading">Loading...</div>
          <select class="grow p-1" v-model="formData.major_two_id">
            <option :value="null">None</option>
            <option v-for="major in majors" :key="major.id" :value="major.id">
              {{ major.major_name }}
            </option>
          </select>
        </div>
        <p v-if="errors.major_two_id" class="text-error">
          {{ errors.major_two_id[0] }}
        </p>
      </div>
      <div class="justify-end flex flex-row space-x-5">
        <RouterLink :to="{ name: 'profile' }">
          <button
            @submit=""
            class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 bg-secondary hover:bg-tertiary hover:text-background border-2 border-tertiary text-tertiary rounded-lg"
          >
            Cancel
          </button>
        </RouterLink>
        <button
          class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 bg-secondary hover:bg-tertiary hover:text-background border-2 border-tertiary text-tertiary rounded-lg"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
