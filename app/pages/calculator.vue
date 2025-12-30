<template>
  <div>
    <CalculatorTaxe />
  </div>
</template>

<script setup>
const { finishLoading } = usePageLoad();

onMounted(() => {
  finishLoading();
});

definePageMeta({
  middleware: "auth",
});
</script>
