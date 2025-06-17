import { defineStore } from "pinia";
import { nextTick } from "vue";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      user_info: null,
      major_one: null,
      major_two: null,
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
          this.major_one = data.major_one;
          this.major_two = data.major_two;
        }
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
        this.major_one = data.major_one;
        this.major_two = data.major_two;
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
      if (res.ok) {
        this.user = null;
        this.user_info = null;
        this.major_one = null;
        this.major_two = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      }
    },
    // Update user profile ----------------------------/
    async update(formData) {
      if (formData.major_one_id == formData.major_two_id && formData.major_one_id !== null) {
        this.errors["major_two_id"] = ["Majors must be different"];
        this.errors["major_one_id"] = ["Majors must be different"];
      } else {
        const res = await fetch("/api/user", {
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.errors = {};
          this.user_info = data.userInfo;
          this.major_one = data.major_one;
          this.major_two = data.major_two;
          this.router.push({ name: "profile" });
        }
      }
    },
  },
});
