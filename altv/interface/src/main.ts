import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";

import "@/styles/main.scss";
import EventObserver from "@/observer";

import "@/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.provide("observer", new EventObserver());
app.component("fa", FontAwesomeIcon);

app.mount("#app");
