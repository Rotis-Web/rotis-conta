<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed top-0 left-0 lg:left-64 right-0 bottom-0 flex items-center justify-center bg-white bg-opacity-90"
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
const isLoading = ref(false);

nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  setTimeout(() => {
    isLoading.value = false;
  }, 150);
});

onMounted(() => {
  isLoading.value = false;
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
