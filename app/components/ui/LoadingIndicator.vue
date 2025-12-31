<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed top-0 right-0 bottom-0 flex items-center justify-center bg-white"
      :class="hasSidebar ? 'left-0 lg:left-64' : 'left-0'"
      style="z-index: 9998"
    >
      <div class="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-600 rounded-full animate-progress"></div>
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

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-progress {
  width: 40%;
  animation: progress 1.5s ease-in-out infinite;
}
</style>
