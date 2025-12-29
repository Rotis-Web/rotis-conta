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
            class="bg-white w-full md:w-full md:max-w-3xl md:rounded-lg h-full md:h-auto max-h-screen overflow-y-auto"
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
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="dataInregistrarii"
                  >
                    Data Înregistrării *
                  </label>
                  <input
                    v-model="form.dataInregistrarii"
                    type="date"
                    name="dataInregistrarii"
                    id="dataInregistrarii"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="numar"
                    >
                      Număr Document
                    </label>
                    <input
                      v-model="form.nrSiDataDocument.numar"
                      type="text"
                      required
                      placeholder="Numărul documentului"
                      name="numar"
                      id="numar"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="data"
                    >
                      Data Document
                    </label>
                    <input
                      v-model="form.nrSiDataDocument.data"
                      type="date"
                      required
                      placeholder="Data documentului"
                      name="data"
                      id="data"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="emitent"
                  >
                    Emitent
                  </label>
                  <input
                    v-model="form.emitent"
                    type="text"
                    required
                    name="emitent"
                    id="emitent"
                    placeholder="Ex: Primăria Oradea, ANAF, etc."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="continutPeScurt"
                  >
                    Conținutul pe scurt al documentului *
                  </label>
                  <textarea
                    v-model="form.continutPeScurt"
                    required
                    name="continutPeScurt"
                    id="continutPeScurt"
                    rows="3"
                    placeholder="Descriere scurtă a documentului..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="compartimentSiSemnatura"
                  >
                    Compartiment și Semnătura de Primire
                  </label>
                  <input
                    v-model="form.compartimentSiSemnatura"
                    type="text"
                    name="compartimentSiSemnatura"
                    id="compartimentSiSemnatura"
                    placeholder="Ex: Compartiment 1, Semnătura 1"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="dataExpedierii"
                    >
                      Data Expedierii
                    </label>
                    <input
                      v-model="form.dataExpedierii"
                      type="date"
                      required
                      name="dataExpedierii"
                      id="dataExpedierii"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="destinatar"
                    >
                      Destinatar
                    </label>
                    <input
                      v-model="form.destinatar"
                      type="text"
                      required
                      name="destinatar"
                      id="destinatar"
                      placeholder="Ex: Primăria Oradea, ANAF, etc."
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="nrInregistrareLaCare"
                  >
                    Nr. de înregistrare la care se conexează
                  </label>
                  <input
                    v-model="form.nrInregistrareLaCare"
                    type="text"
                    name="nrInregistrareLaCare"
                    id="nrInregistrareLaCare"
                    placeholder="Nr. 123456"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
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
const registreStore = useRegistreStore();
const today = new Date().toISOString().split("T")[0]!;

const form = ref({
  dataInregistrarii: today,
  nrSiDataDocument: {
    numar: "",
    data: today,
  },
  emitent: "",
  continutPeScurt: "",
  compartimentSiSemnatura: "",
  dataExpedierii: today,
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

    form.value = {
      dataInregistrarii: today,
      nrSiDataDocument: {
        numar: "",
        data: today,
      },
      emitent: "",
      continutPeScurt: "",
      compartimentSiSemnatura: "",
      dataExpedierii: today,
      destinatar: "",
      nrInregistrareLaCare: "",
    };
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
