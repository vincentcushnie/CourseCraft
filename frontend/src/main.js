import { createApp, markRaw } from "vue"; // Import Vue
import App from "./App.vue"; // Main app component
import { createPinia } from "pinia"; // Pinia state management
import router from "./router"; // Import router
import "./assets/main.css"; // Global styles

const app = createApp(App); // Create Vue app instance
const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

app.use(pinia); // Use Pinia for state management
app.use(router); // Add router to the app
app.mount("#app"); // Mount the app to the DOM
