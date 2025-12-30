<template>
  <div class="min-h-screen bg-white flex flex-col">
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div class="max-w-2xl mx-auto text-center">
        <div class="mb-12">
          <NuxtImg
            src="/rotis-conta-logo.webp"
            alt="Roti's Conta Logo"
            width="260"
            height="65"
            class="mx-auto"
            preload
          />
        </div>

        <h1 class="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
          Contabilitate simplificată
        </h1>

        <p
          class="text-md sm:text-lg text-gray-600 mb-8 max-w-[33ch] mx-auto sm:max-w-[50ch]"
        >
          Gestionează facturi, registre și documente<br
            class="hidden sm:block"
          />
          într-un singur loc
        </p>

        <NuxtLink
          to="/login"
          class="inline-block px-20 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
        >
          Începe acum
        </NuxtLink>

        <div
          class="mt-12 w-full flex flex-row items-center justify-center gap-12 text-center"
        >
          <div>
            <div class="text-4xl mb-3">📄</div>
            <p class="text-gray-700 font-medium">Facturi</p>
          </div>
          <div>
            <div class="text-4xl mb-3">📊</div>
            <p class="text-gray-700 font-medium">Registre</p>
          </div>
          <div>
            <div class="text-4xl mb-3">🧮</div>
            <p class="text-gray-700 font-medium">Calculator</p>
          </div>
        </div>
      </div>
    </div>

    <footer
      class="py-8 text-center text-sm text-gray-500 border-t border-gray-100"
    >
      <p>
        &copy; {{ new Date().getFullYear() }} Roti's Web. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
const { finishLoading } = usePageLoad();

onMounted(() => {
  finishLoading();
});

definePageMeta({
  layout: "auth",
});
</script>
