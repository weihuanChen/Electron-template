import { createApp } from "vue";
import "./assets/style.css";
import "./assets/icon/iconfont.css";
import { router } from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";


createApp(App).use(createPinia()).use(router).mount("#app");
