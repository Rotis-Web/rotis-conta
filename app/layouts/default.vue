<template>
  <div class="min-h-screen bg-gray-50">
    <div
      class="lg:hidden border-b border-gray-200 fixed inset-x-0 top-0 z-30 bg-white"
    >
      <div class="flex items-center justify-between px-4 py-4">
        <button
          @click="mobileMenuOpen = true"
          class="text-gray-600 hover:text-gray-900"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <NuxtLink to="/dashboard">
          <NuxtImg
            src="/rotis-conta-logo.webp"
            alt="Roti's Conta Logo"
            width="120"
            height="32"
            preload
          />
        </NuxtLink>

        <div class="w-6"></div>
      </div>
    </div>

    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        @click="mobileMenuOpen = false"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
      ></div>
    </transition>

    <transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 lg:hidden flex flex-col"
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between p-4 bg-white">
            <NuxtImg
              src="/rotis-conta-logo.webp"
              alt="Roti's Conta Logo"
              width="120"
              height="32"
              preload
            />
            <button
              @click="mobileMenuOpen = false"
              class="text-gray-600 hover:text-gray-900"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav class="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
            <div class="flex flex-col gap-2">
              <NuxtLink
                to="/dashboard"
                @click="mobileMenuOpen = false"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                <svg
                  class="mr-3 h-5 w-5"
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
              <NuxtLink
                to="/calculator"
                @click="mobileMenuOpen = false"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                <svg
                  class="mr-3 h-5 w-5"
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

              <NuxtLink
                to="/setari"
                @click="mobileMenuOpen = false"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                <svg
                  class="mr-3 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Setări
              </NuxtLink>
            </div>

            <div class="mt-4">
              <p
                class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Registre
              </p>
              <div class="mt-2 space-y-1">
                <NuxtLink
                  to="/registre/incasari-plati"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Încasări și Plăți
                </NuxtLink>
                <NuxtLink
                  to="/registre/intrare-iesire"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Intrare-Ieșire
                </NuxtLink>
                <NuxtLink
                  to="/registre/evidenta-fiscala"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Evidență Fiscală
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
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Facturi Emise
                </NuxtLink>
                <NuxtLink
                  to="/facturi/primite"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Facturi Primite
                </NuxtLink>
                <NuxtLink
                  to="/documente/contracte"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Contracte
                </NuxtLink>
                <NuxtLink
                  to="/documente/extrase"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Extrase de Cont
                </NuxtLink>
                <NuxtLink
                  to="/documente/declaratii"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Declarații
                </NuxtLink>
                <NuxtLink
                  to="/documente/plati-impozite"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Plăți și impozite
                </NuxtLink>
                <NuxtLink
                  to="/documente/diverse"
                  @click="mobileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                  active-class="bg-gray-800 text-white"
                >
                  Diverse
                </NuxtLink>
              </div>
            </div>
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
    </transition>

    <div
      class="fixed inset-y-0 left-0 w-64 bg-gray-900 hidden lg:flex flex-col"
    >
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
          <div class="flex flex-col gap-2">
            <NuxtLink
              to="/dashboard"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
              active-class="bg-gray-800 text-white"
            >
              <svg
                class="mr-3 h-5 w-5"
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

            <NuxtLink
              to="/calculator"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
              active-class="bg-gray-800 text-white"
            >
              <svg
                class="mr-3 h-5 w-5"
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

            <NuxtLink
              to="/setari"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
              active-class="bg-gray-800 text-white"
            >
              <svg
                class="mr-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Setări
            </NuxtLink>
          </div>

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
              <NuxtLink
                to="/registre/evidenta-fiscala"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Evidență Fiscală
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
              <NuxtLink
                to="/documente/extrase"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Extrase de Cont
              </NuxtLink>
              <NuxtLink
                to="/documente/declaratii"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Declarații
              </NuxtLink>
              <NuxtLink
                to="/documente/plati-impozite"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Plăți și impozite
              </NuxtLink>
              <NuxtLink
                to="/documente/diverse"
                class="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white"
                active-class="bg-gray-800 text-white"
              >
                Diverse
              </NuxtLink>
            </div>
          </div>
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

    <div class="pl-0 lg:pl-64 pt-12 lg:pt-0">
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
const mobileMenuOpen = ref(false);

const handleLogout = async () => {
  if (confirm("Sigur vrei să te deconectezi?")) {
    await logout();
  }
};

const route = useRoute();
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);
</script>
