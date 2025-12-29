<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition-transform duration-300"
          enter-from-class="translate-y-full md:translate-y-0 md:scale-95"
          enter-to-class="translate-y-0 md:scale-100"
          leave-active-class="transition-transform duration-300"
          leave-from-class="translate-y-0 md:scale-100"
          leave-to-class="translate-y-full md:translate-y-0 md:scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white w-full md:w-full md:max-w-2xl md:rounded-lg h-full md:h-auto max-h-screen overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10"
            >
              <h3 class="text-lg font-semibold text-gray-900">
                Adaugă Înregistrare
              </h3>
              <button
                @click="$emit('close')"
                type="button"
                name="close"
                id="close"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6"
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

            <div class="p-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div v-if="error" class="rounded-md bg-red-50 p-4">
                  <div class="text-sm text-red-800">{{ error }}</div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-2"
                    for="tip"
                  >
                    Tip operațiune *
                  </label>
                  <div class="flex space-x-4">
                    <label class="flex items-center" for="tip">
                      <input
                        v-model="form.tip"
                        type="radio"
                        name="tip"
                        id="tip"
                        value="tip"
                        checked
                        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                      />
                      <span class="ml-2 text-sm text-gray-700">Încasare</span>
                    </label>
                    <label class="flex items-center" for="tip">
                      <input
                        v-model="form.tip"
                        type="radio"
                        name="tip"
                        value="tip"
                        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                      />
                      <span class="ml-2 text-sm text-gray-700">Plată</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="data"
                  >
                    Data *
                  </label>
                  <input
                    v-model="form.data"
                    type="date"
                    name="data"
                    id="data"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="document"
                    >
                      Tip Document
                    </label>
                    <select
                      v-model="form.document.tip"
                      required
                      name="document"
                      id="document"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="numar"
                    >
                      Număr Document
                    </label>
                    <input
                      v-model="form.document.numar"
                      type="text"
                      required
                      placeholder="Numărul documentului"
                      name="numar"
                      id="numar"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="fel"
                  >
                    Felul Operațiunii *
                  </label>
                  <input
                    v-model="form.felulOperatiunii"
                    type="text"
                    name="fel"
                    id="fel"
                    required
                    placeholder="Ex: Încasare pentru servicii de dezvoltare website"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="suma"
                  >
                    Sumă (RON) *
                  </label>
                  <input
                    v-model.number="form.suma"
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 1000"
                    name="suma"
                    id="suma"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="banca"
                  >
                    Bancă
                  </label>
                  <input
                    v-model="form.banca"
                    type="text"
                    name="banca"
                    id="banca"
                    placeholder="Ex: BCR, BRD, ING"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    :disabled="loading"
                    name="cancel"
                    id="cancel"
                    @click="$emit('close')"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    name="save"
                    id="save"
                    :disabled="loading"
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {{ loading ? "Se salvează..." : "Salvează" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

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
  suma: "",
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
    emit("close");

    form.value = {
      tip: "incasare",
      data: new Date().toISOString().split("T")[0],
      document: { tip: "", numar: "" },
      felulOperatiunii: "",
      suma: "",
      banca: "",
    };
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
