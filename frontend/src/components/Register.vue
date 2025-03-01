<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

onMounted(() => {
  errors.value = {};
});
</script>

<template>
  <div class="greetings">
    <h1 class="green bg-sky-700">Register a new account</h1>
    <form
      @submit.prevent="authenticate('register', formData)"
      class="w-1/2 mx-auto space-y-6"
    >
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" />
        <p v-if="errors.name" class="text-[#500000]">{{ errors.name[0] }}</p>
      </div>
      <div>
        <input type="text" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="text-[#500000]">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="formData.password"
        />
        <p v-if="errors.password" class="text-[#500000]">
          {{ errors.password[0] }}
        </p>
      </div>
      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="formData.password_confirmation"
        />
      </div>
      <button>Register</button>
    </form>
  </div>
</template>
