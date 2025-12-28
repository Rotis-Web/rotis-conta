<template>
  <div>
    <RegistruIntrareIesire />
  </div>
</template>

<script setup>
import RegistruIntrareIesire from "~/components/registre/RegistruIntrareIesire.vue";

definePageMeta({
  middleware: "auth",
});
</script>
