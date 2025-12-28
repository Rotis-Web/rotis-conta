<template>
  <div>
    <FacturaList tip="emisa" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>
