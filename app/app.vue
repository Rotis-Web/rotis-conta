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

onMounted(() => {
  if (!authStore.initialized) {
    authStore.fetchUser();
  }
});
</script>
