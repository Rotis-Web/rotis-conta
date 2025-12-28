<template>
  <LoginForm />
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: "guest",
});
</script>
