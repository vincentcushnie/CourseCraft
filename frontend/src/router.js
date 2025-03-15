import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/HelloWorld.vue";
import Register from "./components/Register.vue";
import FullHeader from "./components/FullHeader.vue";
import Login from "./components/Login.vue";
import UserProfile from "./components/UserProfile.vue";
import SmallHeader from "./components/SmallHeader.vue";
import DefaultFooter from "./components/DefaultFooter.vue";
import AboutContent from "./components/AboutContent.vue";
import { useAuthStore } from "./stores/auth";
import Create from "./components/Create.vue";

const routes = [
  {
    path: "/",
    name: "home",
    components: {
      default: AboutContent,
      header: FullHeader,
      footer: DefaultFooter,
    },
  },
  {
    path: "/register",
    name: "register",
    components: {
      default: Register,
      header: FullHeader,
      footer: DefaultFooter,
    },
    meta: { guest: true },
  },
  {
    path: "/login",
    name: "login",
    components: {
      default: Login,
      header: FullHeader,
      footer: DefaultFooter,
    },
    meta: { guest: true },
  },
  {
    path: "/create",
    name: "create",
    components: {
      default: Create,
      header: FullHeader,
      footer: DefaultFooter,
    },
    meta: { auth: true },
  },
  {
    path: "/profile",
    name: "profile",
    components: {
      default: UserProfile,
      header: FullHeader,
      footer: DefaultFooter,
    },
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.user && to.meta.guest) {
    return { name: "home" };
  }

  if (!authStore.user && to.meta.auth) {
    return { name: "login" };
  }
});

export default router;
