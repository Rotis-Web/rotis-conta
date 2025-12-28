<template>
  <div class="min-h-screen bg-gray-50">
    <div class="fixed inset-y-0 left-0 w-64 bg-gray-900">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-center p-4 bg-white">
          <NuxtImg
            src="/rotis-conta-logo.webp"
            alt="Roti's Conta Logo"
            width="150"
            height="40"
          />
        </div>

        <nav class="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
          <NuxtLink
            to="/dashboard"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
            active-class="bg-gray-800 text-white"
          >
            <svg
              class="mr-3 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </NuxtLink>

          <div class="mt-4">
            <p
              class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Registre
            </p>
            <div class="mt-2 space-y-1">
              <NuxtLink
                to="/registre/incasari-plati"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Încasări și Plăți
              </NuxtLink>
              <NuxtLink
                to="/registre/intrare-iesire"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Intrare-Ieșire
              </NuxtLink>
            </div>
          </div>

          <div class="mt-4">
            <p
              class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              Documente
            </p>
            <div class="mt-2 space-y-1">
              <NuxtLink
                to="/facturi/emise"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Facturi Emise
              </NuxtLink>
              <NuxtLink
                to="/facturi/primite"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Facturi Primite
              </NuxtLink>
              <NuxtLink
                to="/documente/contracte"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Contracte
              </NuxtLink>
            </div>
          </div>

          <NuxtLink
            to="/calculator"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
            active-class="bg-gray-800 text-white"
          >
            <svg
              class="mr-3 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Calculator Taxe
          </NuxtLink>
        </nav>

        <div class="flex-shrink-0 border-t border-gray-800 p-4">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ user?.nume }}</p>
              <p class="text-xs text-gray-400">{{ user?.email }}</p>
            </div>
            <button
              @click="handleLogout"
              class="ml-3 p-2 text-gray-400 hover:text-white"
              title="Deconectare"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pl-64">
      <main class="py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  if (confirm("Sigur vrei să te deconectezi?")) {
    await logout();
  }
};
</script>
