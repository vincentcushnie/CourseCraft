<script setup>
import { onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
const formData = reactive({
  email: "",
  password: "",
});

onMounted(() => (errors.value = {}));
</script>

<template>
  <div class="flex flex-col justify-center items-center pt-5 font-inter">
    <div class="w-1/2 rounded-md bg-secondary">
      <h1 class="bg-tertiary text-background p-2 bg-sky-700 rounded-t-md">
        Login to your account
      </h1>
      <form
        @submit.prevent="authenticate('login', formData)"
        class="w-1/2 mx-auto space-y-6 my-7"
      >
        <div>
          <input
            type="text"
            placeholder="Email"
            v-model="formData.email"
            class="focus:outline-none focus:ring-0 bg-background rounded-sm w-full pl-2"
          />
          <p v-if="errors.email" class="text-error">{{ errors.email[0] }}</p>
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            v-model="formData.password"
            class="focus:outline-none focus:ring-0 bg-background rounded-sm w-full pl-2"
          />
          <p v-if="errors.password" class="text-error">
            {{ errors.password[0] }}
          </p>
        </div>

        <button
          class="px-2 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center my-1 hover:bg-tertiary hover:text-background"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>
