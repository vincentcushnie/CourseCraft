import { defineStore } from "pinia";

export const useDropdownStore = defineStore("majors", {
  state: () => ({
    options: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchOptions() {
      this.isLoading = true;
      try {
        const response = await fetch("/api/options");
        this.options = await response.json();
      } catch (err) {
        this.error = "Failed to fetch options";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
