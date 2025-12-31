<template>
  <div>
    <RegistruInventar />
  </div>
</template>

<script setup>
import RegistruInventar from "~/components/registre/RegistruInventar.vue";

const { finishLoading } = usePageLoad();

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  finishLoading();
});
</script>
