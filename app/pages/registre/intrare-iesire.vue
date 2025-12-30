<template>
  <div>
    <RegistruIntrareIesire />
  </div>
</template>

<script setup>
const { finishLoading } = usePageLoad();

onMounted(() => {
  finishLoading();
});

import RegistruIntrareIesire from "~/components/registre/RegistruIntrareIesire.vue";

definePageMeta({
  middleware: "auth",
});
</script>
