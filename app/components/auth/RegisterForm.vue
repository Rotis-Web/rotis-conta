<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-2xl w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Înregistrare PFA
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Date autentificare</h3>

          <div>
            <label for="nume" class="block text-sm font-medium text-gray-700"
              >Nume complet</label
            >
            <input
              id="nume"
              name="nume"
              v-model="form.nume"
              type="text"
              required
              placeholder="ex: Popescu Ion"
              class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              id="email"
              name="email"
              v-model="form.email"
              type="email"
              required
              placeholder="ex: contact@pfa.ro"
              class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Parolă</label
            >
            <input
              id="password"
              name="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              placeholder="ex: P4ssw0rd"
              class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Date PFA (opțional)</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700"
                for="denumire"
                >Denumire PFA</label
              >
              <input
                name="denumire"
                id="denumire"
                v-model="form.pfaData.denumire"
                type="text"
                placeholder="ex: Popescu Ion PFA"
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700" for="cui"
                >CUI</label
              >
              <input
                name="cui"
                id="cui"
                v-model="form.pfaData.cui"
                type="text"
                placeholder="ex: 12345678"
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700"
                for="nrRegCom"
                >Nr. Reg. Com.</label
              >
              <input
                name="nrRegCom"
                id="nrRegCom"
                v-model="form.pfaData.nrRegCom"
                type="text"
                placeholder="ex: F40/123/2024"
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700" for="iban"
                >IBAN</label
              >
              <input
                name="iban"
                id="iban"
                v-model="form.pfaData.iban"
                type="text"
                placeholder="ex: RO00BANK12345678901234567890"
                class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            name="register"
            id="register"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Se înregistrează...</span>
            <span v-else>Înregistrare</span>
          </button>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Ai deja cont? Autentifică-te
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth();
const router = useRouter();

const form = ref({
  nume: "",
  email: "",
  password: "",
  pfaData: {
    denumire: "",
    cui: "",
    nrRegCom: "",
    iban: "",
  },
});

const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;

  try {
    await register(form.value);
    router.push("/dashboard");
  } catch (err: any) {
  } finally {
    loading.value = false;
  }
};
</script>
