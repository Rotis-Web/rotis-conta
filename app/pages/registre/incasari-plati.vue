  <template>
    <div>
      <RegistruIncasariPlati />
    </div>
  </template>

  <script setup>
  import RegistruIncasariPlati from "~/components/registre/RegistruIncasariPlati.vue";

  definePageMeta({
    middleware: "auth",
  });
  </script>
