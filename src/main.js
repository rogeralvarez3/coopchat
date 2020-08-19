import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Swal from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ImageUploader from "vue-image-upload-resize";
import VueNativeNotification from "vue-native-notification";
import router from "./router";
import store from "./store";

Vue.use(ImageUploader);
Vue.use(VueNativeNotification, { requestOnNotify: true });
Vue.config.productionTip = false;
Vue.use(Swal);
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
