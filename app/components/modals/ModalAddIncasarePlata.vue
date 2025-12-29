<template>
  <div class="fixed inset-0 z-50 overflow-y-auto min-h-screen min-w-screen">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Adaugă Înregistrare</h3>
          <button
            @click="$emit('close')"
            type="button"
            id="close-modal"
            aria-label="Close modal"
            class="text-gray-400 hover:text-gray-500"
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

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-800">{{ error }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tip operațiune *
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="form.tip"
                  id="incasare"
                  name="incasare"
                  type="radio"
                  value="incasare"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                />
                <span class="ml-2 text-sm text-gray-700">Încasare</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="form.tip"
                  id="plata"
                  name="plata"
                  type="radio"
                  value="plata"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                />
                <span class="ml-2 text-sm text-gray-700">Plată</span>
              </label>
            </div>
          </div>

          <div>
            <label for="data" class="block text-sm font-medium text-gray-700">
              Data *
            </label>
            <input
              id="data"
              name="data"
              v-model="form.data"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="documentTip"
                class="block text-sm font-medium text-gray-700"
              >
                Tip Document
              </label>
              <select
                id="documentTip"
                name="documentTip"
                v-model="form.document.tip"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              >
                <option value="">Selectează</option>
                <option value="Extras Bancar">Extras Bancar</option>
                <option value="Factura">Factură</option>
                <option value="Chitanta">Chitanță</option>
                <option value="Dispoziție plată">Dispoziție plată</option>
              </select>
            </div>
            <div>
              <label
                for="documentNumar"
                class="block text-sm font-medium text-gray-700"
              >
                Număr Document
              </label>
              <input
                id="documentNumar"
                name="documentNumar"
                v-model="form.document.numar"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div>
            <label
              for="felulOperatiunii"
              class="block text-sm font-medium text-gray-700"
            >
              Felul Operațiunii *
            </label>
            <input
              id="felulOperatiunii"
              name="felulOperatiunii"
              v-model="form.felulOperatiunii"
              type="text"
              required
              placeholder="Ex: Încasare pentru servicii de dezvoltare website"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label for="suma" class="block text-sm font-medium text-gray-700">
              Sumă (RON) *
            </label>
            <input
              id="suma"
              name="suma"
              v-model.number="form.suma"
              type="number"
              step="0.01"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label for="banca" class="block text-sm font-medium text-gray-700">
              Bancă
            </label>
            <input
              id="banca"
              name="banca"
              v-model="form.banca"
              type="text"
              placeholder="Ex: BCR, BRD, ING"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              id="cancel"
              aria-label="Cancel"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              id="save"
              aria-label="Save"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {{ loading ? "Se salvează..." : "Salvează" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close", "success"]);
const { addEntry } = useRegistreIncasariPlati();

const form = ref({
  tip: "incasare" as "incasare" | "plata",
  data: new Date().toISOString().split("T")[0],
  document: {
    tip: "",
    numar: "",
  },
  felulOperatiunii: "",
  suma: 0,
  banca: "",
});

const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    await addEntry(form.value);
    emit("success");
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
