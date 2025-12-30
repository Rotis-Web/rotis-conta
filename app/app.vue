<template>
  <div>
    <LoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const pageLoadingStore = usePageLoadingStore();

if (process.client) {
  pageLoadingStore.startLoading();
}

onMounted(async () => {
  try {
    if (!authStore.initialized) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
  }
});
</script>
