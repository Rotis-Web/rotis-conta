import Vue3Toastify, { toast, type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  } as ToastContainerOptions);

  return {
    provide: {
      toast,
    },
  };
});
