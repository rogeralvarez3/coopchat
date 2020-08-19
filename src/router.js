import Vue from "vue";
import Router from "vue-router";
import Chat from "./components/Chat";
import Inicio from "./components/HelloWorld";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "inicio",
      component: Inicio
    },
    {
      path: "/chat/:id",
      name: "chat",
      component: Chat
    }
  ]
});
