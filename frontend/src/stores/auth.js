import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      user_info: null,
      errors: {},
    };
  },
  getters: {
    userAge: (state) => `${state.user} is 30`,
  },
  actions: {
    // Get authenticated user ----------------------------/
    async getUser() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/user", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.user = data.user;
          this.user_info = data.user_info;
        }
        console.log(data);
      }
    },
    // Login or register -----------------------------/
    async authenticate(apiRoute, formData) {
      const res = await fetch(`/api/${apiRoute}`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        localStorage.setItem("token", data.token);
        this.user = data.user;
        this.user_info = data.user_info;
        this.router.push({ name: "home" });
      }
    },
    // Logout user --------------------------------/
    async logout() {
      const res = await fetch("/api/logout", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        this.user = null;
        this.user_info = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      }
    },
  },
});
