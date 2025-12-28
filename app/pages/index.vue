<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center text-white mb-12">
        <h1 class="text-5xl font-bold mb-4">Contabilitate PFA</h1>
        <p class="text-xl opacity-90">
          Gestionează registrele, facturile și documentele tale PFA într-un
          singur loc
        </p>
      </div>

      <div
        class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-3xl mb-3">📊</div>
          <h3 class="text-lg font-semibold mb-2">Registre Complete</h3>
          <p class="text-sm opacity-90">
            Registru încasări-plăți, intrare-ieșire și evidență fiscală
          </p>
        </div>

        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-3xl mb-3">💰</div>
          <h3 class="text-lg font-semibold mb-2">Calculator Taxe</h3>
          <p class="text-sm opacity-90">
            Calculează automat CAS, CASS și impozitul pe venit
          </p>
        </div>

        <div
          class="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white"
        >
          <div class="text-3xl mb-3">📁</div>
          <h3 class="text-lg font-semibold mb-2">Documente</h3>
          <p class="text-sm opacity-90">
            Stochează facturi, contracte și declarații în cloud
          </p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          to="/login"
          class="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
        >
          Începe Acum
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});
</script>
