import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import router from "./router";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "./assets/main.css";
import "./assets/tailwind.css";
import AutoComplete from "primevue/autocomplete";

import "primevue/resources/themes/aura-light-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.use(ToastService);

app.component("Toast", Toast);
app.component('AutoComplete', AutoComplete);

app.mount("#app");
