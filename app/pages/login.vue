<template>
  <LoginForm />
</template>

<script setup>
const { finishLoading } = usePageLoad();

onMounted(() => {
  finishLoading();
});

definePageMeta({
  layout: "auth",
  middleware: "guest",
});
</script>
