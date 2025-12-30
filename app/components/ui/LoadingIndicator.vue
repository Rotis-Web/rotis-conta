<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed top-0 right-0 bottom-0 flex items-center justify-center bg-white"
      :class="hasSidebar ? 'left-0 lg:left-64' : 'left-0'"
      style="z-index: 9998"
    >
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"
        ></div>
        <p class="mt-3 text-sm font-medium text-gray-700">
          Se încarcă pagina...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const route = useRoute();
const pageLoadingStore = usePageLoadingStore();
const isLoading = computed(() => pageLoadingStore.isLoading);
const hasSidebar = computed(() => route.meta.layout !== "auth");

nuxtApp.hook("page:start", () => {
  pageLoadingStore.startLoading();
});

nuxtApp.hook("page:finish", () => {});

watch(isLoading, (v) => {
  if (!process.client) return;
  document.documentElement.style.overflow = v ? "hidden" : "";
  document.body.style.overflow = v ? "hidden" : "";
});

onMounted(() => {
  if (!pageLoadingStore.isLoading) {
    pageLoadingStore.stopLoading();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
