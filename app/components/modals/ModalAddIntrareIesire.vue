<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Adaugă Înregistrare Intrare-Ieșire
          </h3>
          <button
            type="button"
            id="close-modal"
            aria-label="Close modal"
            @click="$emit('close')"
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
            <label
              for="dataInregistrarii"
              class="block text-sm font-medium text-gray-700"
            >
              Data Înregistrării *
            </label>
            <input
              id="dataInregistrarii"
              name="dataInregistrarii"
              v-model="form.dataInregistrarii"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
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
                v-model="form.nrSiDataDocument.numar"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                for="documentData"
                class="block text-sm font-medium text-gray-700"
              >
                Data Document
              </label>
              <input
                id="documentData"
                name="documentData"
                v-model="form.nrSiDataDocument.data"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div>
            <label
              for="emitent"
              class="block text-sm font-medium text-gray-700"
            >
              Emitent
            </label>
            <input
              id="emitent"
              name="emitent"
              v-model="form.emitent"
              type="text"
              placeholder="Ex: Primăria Oradea, ANAF, etc."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              for="continutPeScurt"
              class="block text-sm font-medium text-gray-700"
            >
              Conținutul pe scurt al documentului *
            </label>
            <textarea
              id="continutPeScurt"
              name="continutPeScurt"
              v-model="form.continutPeScurt"
              required
              rows="3"
              placeholder="Descriere scurtă a documentului..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            ></textarea>
          </div>

          <div>
            <label
              for="compartiment"
              class="block text-sm font-medium text-gray-700"
            >
              Compartiment și Semnătura de Primire
            </label>
            <input
              id="compartiment"
              name="compartiment"
              v-model="form.compartimentSiSemnatura"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="dataExpedierii"
                class="block text-sm font-medium text-gray-700"
              >
                Data Expedierii
              </label>
              <input
                id="dataExpedierii"
                name="dataExpedierii"
                v-model="form.dataExpedierii"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                for="destinatar"
                class="block text-sm font-medium text-gray-700"
              >
                Destinatar
              </label>
              <input
                id="destinatar"
                name="destinatar"
                v-model="form.destinatar"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div>
            <label
              for="nrInregistrareLaCare"
              class="block text-sm font-medium text-gray-700"
            >
              Nr. de înregistrare la care se conexează
            </label>
            <input
              id="nrInregistrareLaCare"
              name="nrInregistrareLaCare"
              v-model="form.nrInregistrareLaCare"
              type="text"
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
const registreStore = useRegistreStore();

const form = ref({
  dataInregistrarii: new Date().toISOString().split("T")[0],
  nrSiDataDocument: {
    numar: "",
    data: "",
  },
  emitent: "",
  continutPeScurt: "",
  compartimentSiSemnatura: "",
  dataExpedierii: "",
  destinatar: "",
  nrInregistrareLaCare: "",
});

const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    await registreStore.addIntrareIesire(form.value);
    emit("success");
    emit("close");
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
