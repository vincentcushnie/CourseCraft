import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useCachedCourseDataStore = defineStore("cachedCourseDataStore", {
  state: () => ({
    courseDepartments: {},
    cachedDepartmentMenus: {},
  }),

  actions: {
    async setupDepartments(token) {
      const res = await fetch("/api/courses/departments", {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        this.courseDepartments = data;
      }
    },
    async getDepartmentCourses(department, token) {
      const res = await fetch(`/api/courses/department/${department}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        this.cachedDepartmentMenus[department] = data;
      }
    },
  },
});
