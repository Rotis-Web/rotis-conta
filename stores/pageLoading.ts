import { defineStore } from "pinia";

export const usePageLoadingStore = defineStore("pageLoading", {
  state: () => ({
    isLoading: false,
  }),

  actions: {
    startLoading() {
      this.isLoading = true;
    },

    stopLoading() {
      setTimeout(() => {
        this.isLoading = false;
      }, 150);
    },
  },
});
