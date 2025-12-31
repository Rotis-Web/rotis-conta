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
                Adaugă Element Inventar
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
                    for="data"
                  >
                    Data Inventarului *
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

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="elemente"
                  >
                    Elementele Inventariate *
                  </label>
                  <textarea
                    v-model="form.elementeInventariate"
                    name="elemente"
                    id="elemente"
                    required
                    rows="3"
                    placeholder="Ex: Laptop Dell Latitude, Calculator birou, etc."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="valoareContabila"
                    >
                      Valoare Contabilă (RON) *
                    </label>
                    <input
                      v-model.number="form.valoareContabila"
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 2500.00"
                      name="valoareContabila"
                      id="valoareContabila"
                      min="0"
                      @input="calculateDifference"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 mb-1"
                      for="valoareCirculatie"
                    >
                      Valoare de Circulație (RON) *
                    </label>
                    <input
                      v-model.number="form.valoareCirculatie"
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 2000.00"
                      name="valoareCirculatie"
                      id="valoareCirculatie"
                      min="0"
                      @input="calculateDifference"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div
                  v-if="diferentaCalculata !== 0"
                  class="p-4 rounded-lg"
                  :class="diferentaCalculata > 0 ? 'bg-green-50' : 'bg-red-50'"
                >
                  <div
                    class="text-sm font-medium mb-1"
                    :class="
                      diferentaCalculata > 0 ? 'text-green-800' : 'text-red-800'
                    "
                  >
                    Diferență de Evaluare:
                  </div>
                  <div
                    class="text-2xl font-bold"
                    :class="
                      diferentaCalculata > 0 ? 'text-green-900' : 'text-red-900'
                    "
                  >
                    {{ formatCurrency(Math.abs(diferentaCalculata)) }}
                    <span class="text-sm">
                      ({{ diferentaCalculata > 0 ? "Plus" : "Minus" }})
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="cauze"
                  >
                    Cauze Diferente
                  </label>
                  <textarea
                    v-model="form.diferenteEvaluare.cauze"
                    name="cauze"
                    id="cauze"
                    rows="2"
                    placeholder="Ex: Depreciere, piață, uzură, etc."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    :disabled="loading"
                    name="cancel"
                    id="cancel"
                    @click="$emit('close')"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
const { addEntry } = useRegistreInventar();

const form = ref({
  data: new Date().toISOString().split("T")[0],
  elementeInventariate: "",
  valoareContabila: 0,
  valoareCirculatie: 0,
  diferenteEvaluare: {
    valoare: 0,
    cauze: "",
  },
});

const loading = ref(false);
const error = ref("");
const diferentaCalculata = ref(0);

const calculateDifference = () => {
  diferentaCalculata.value =
    form.value.valoareCirculatie - form.value.valoareContabila;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(amount);
};

const resetForm = () => {
  form.value = {
    data: new Date().toISOString().split("T")[0],
    elementeInventariate: "",
    valoareContabila: 0,
    valoareCirculatie: 0,
    diferenteEvaluare: {
      valoare: 0,
      cauze: "",
    },
  };
  diferentaCalculata.value = 0;
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    form.value.diferenteEvaluare.valoare = diferentaCalculata.value;

    await addEntry(form.value);
    emit("success");
    emit("close");
    resetForm();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
