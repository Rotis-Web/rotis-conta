<template>
  <div>
    <FacturaList tip="primita" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
