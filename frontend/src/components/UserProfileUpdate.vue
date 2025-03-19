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
    console.log(data.errors);
  } else {
    majors.value = data;
  }
  loading.value = false;
});
</script>

<template>
  <h1 class="green bg-sky-700">My Profile</h1>
  <form @submit.prevent="update(formData)" class="w-1/2 mx-auto space-y-6">
    <div>
      <p>My name:</p>
      <input
        type="text"
        placeholder="user_info.name"
        v-model="formData.name"
        class="border-black border-1"
      />
      <p v-if="errors.name" class="text-[#500000]">{{ errors.name[0] }}</p>
    </div>

    <div>
      <p>Major One:</p>
      <div class="border-1 border-black">
        <div v-if="loading">Loading...</div>
        <select v-model="formData.major_one_id">
          <option v-for="major in majors" :key="major.id" :value="major.id">
            {{ major.major_name }}
          </option>
        </select>
      </div>
      <p v-if="errors.major_one_id" class="text-[#500000]">
        {{ errors.major_one_id[0] }}
      </p>
    </div>
    <div>
      <p>Major Two:</p>
      <div class="border-1 border-black">
        <div v-if="loading">Loading...</div>
        <select v-model="formData.major_two_id">
          <option v-for="major in majors" :key="major.id" :value="major.id">
            {{ major.major_name }}
          </option>
        </select>
      </div>
      <p v-if="errors.major_two_id" class="text-[#500000]">
        {{ errors.major_two_id[0] }}
      </p>
    </div>
    <button
      class="my-5 mx-5 py-5 px-5 rounded-full bg-red-100 hover:bg-red-500 border-1 border-black"
    >
      Save
    </button>
  </form>
</template>
