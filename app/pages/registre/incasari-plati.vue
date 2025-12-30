<template>
  <div>
    <RegistruIncasariPlati />
  </div>
</template>

<script setup>
const { finishLoading } = usePageLoad();

onMounted(() => {
  finishLoading();
});

import RegistruIncasariPlati from "~/components/registre/RegistruIncasariPlati.vue";

definePageMeta({
  middleware: "auth",
});
</script>
