import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    message: "Hello from Pinia!",
  }),
  actions: {
    updateMessage(newMessage) {
      this.message = newMessage;
    },
  },
});
