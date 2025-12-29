<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto min-h-screen min-w-screen"
    @click.self="$emit('close')"
  >
    <div class="flex items-center justify-center min-h-screen px-4">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div
        class="relative bg-white rounded-lg max-w-3xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Adaugă Factură {{ tip === "emisa" ? "Emisă" : "Primită" }}
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

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Serie</label
              >
              <input
                id="serie"
                name="serie"
                v-model="form.serie"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Număr *</label
              >
              <input
                id="numarFactura"
                name="numarFactura"
                v-model="form.numarFactura"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Data *</label
              >
              <input
                id="data"
                name="data"
                v-model="form.data"
                type="date"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Date Client</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nume Client</label
                >
                <input
                  id="nume"
                  name="nume"
                  v-model="form.client.nume"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >CUI / CNP</label
                >
                <input
                  id="cui"
                  name="cui"
                  v-model="form.client.cui"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Adresă</label
                >
                <input
                  id="adresa"
                  name="adresa"
                  v-model="form.client.adresa"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-gray-900">Servicii</h4>
              <button
                type="button"
                aria-label="Add service"
                title="Add service"
                :disabled="loading"
                name="addService"
                @click="addService"
                class="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                + Adaugă serviciu
              </button>
            </div>

            <div
              v-for="(serviciu, index) in form.servicii"
              :key="index"
              class="grid grid-cols-5 gap-2 mb-2"
            >
              <div class="col-span-2">
                <input
                  id="denumire"
                  name="denumire"
                  v-model="serviciu.denumire"
                  type="text"
                  placeholder="Denumire"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <input
                  id="cantitate"
                  name="cantitate"
                  v-model.number="serviciu.cantitate"
                  type="number"
                  placeholder="Cant."
                  @input="calculateService(index)"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <input
                  id="pretUnitar"
                  name="pretUnitar"
                  v-model.number="serviciu.pretUnitar"
                  type="number"
                  step="0.01"
                  placeholder="Preț"
                  @input="calculateService(index)"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div class="flex items-center space-x-2">
                <input
                  id="valoare"
                  name="valoare"
                  :value="serviciu.valoare"
                  type="number"
                  disabled
                  placeholder="Valoare"
                  class="block w-full rounded-md border-gray-300 bg-gray-50 sm:text-sm p-2"
                />
                <button
                  type="button"
                  aria-label="Remove service"
                  title="Remove service"
                  name="removeService"
                  @click="removeService(index)"
                  class="text-red-600 hover:text-red-900"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="border-t pt-4 bg-gray-50 p-4 rounded-lg">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{
                  formatCurrency(form.subtotal)
                }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">TVA (0%):</span>
                <span class="font-medium">{{ formatCurrency(form.tva) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{{ formatCurrency(form.total) }}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Status *</label
            >
            <select
              id="status"
              name="status"
              v-model="form.status"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            >
              <option value="neplatita">Neplătită</option>
              <option value="platita">Plătită</option>
              <option value="partial">Parțial plătită</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fișier factură (opțional)
            </label>
            <input
              id="file"
              name="file"
              ref="fileInput"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              @change="handleFileChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div class="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              id="cancel"
              aria-label="Cancel"
              name="cancel"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              id="save"
              aria-label="Save"
              name="save"
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
import { put } from "@vercel/blob";

const props = defineProps<{
  tip: "emisa" | "primita";
}>();

const emit = defineEmits(["close", "success"]);
const facturiStore = useFacturiStore();

const form = ref({
  tip: props.tip,
  serie: "",
  numarFactura: "",
  data: new Date().toISOString().split("T")[0],
  client: {
    nume: "",
    cui: "",
    adresa: "",
  },
  servicii: [
    {
      denumire: "",
      cantitate: undefined as number | undefined,
      pretUnitar: undefined as number | undefined,
      valoare: 0,
    },
  ],
  subtotal: 0,
  tva: 0,
  total: 0,
  status: "neplatita" as "platita" | "neplatita" | "partial",
  fisier: undefined as { url: string; key: string; nume: string } | undefined,
});

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const loading = ref(false);
const error = ref("");

const addService = () => {
  form.value.servicii.push({
    denumire: "",
    cantitate: undefined as number | undefined,
    pretUnitar: undefined as number | undefined,
    valoare: 0,
  });
};

const removeService = (index: number) => {
  form.value.servicii.splice(index, 1);
  calculateTotals();
};

const calculateService = (index: number) => {
  const serviciu = form.value.servicii[index];
  if (serviciu) {
    const cantitate =
      typeof serviciu.cantitate === "number" && !isNaN(serviciu.cantitate)
        ? serviciu.cantitate
        : 0;
    const pretUnitar =
      typeof serviciu.pretUnitar === "number" && !isNaN(serviciu.pretUnitar)
        ? serviciu.pretUnitar
        : 0;
    serviciu.valoare = cantitate * pretUnitar;
    calculateTotals();
  }
};

const calculateTotals = () => {
  form.value.subtotal = form.value.servicii.reduce(
    (sum, s) => sum + (s.valoare || 0),
    0
  );
  form.value.tva = 0;
  form.value.total = form.value.subtotal + form.value.tva;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(amount);
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";

  try {
    let fisierData = undefined;
    if (selectedFile.value) {
      const blob = await put(selectedFile.value.name, selectedFile.value, {
        access: "public",
        addRandomSuffix: true,
      });

      fisierData = {
        url: blob.url,
        key: blob.pathname,
        nume: selectedFile.value.name,
      };
    }

    // Clean servicii data - ensure all values are numbers
    const cleanedServicii = form.value.servicii.map((s) => ({
      denumire: s.denumire,
      cantitate: s.cantitate || 0,
      pretUnitar: s.pretUnitar || 0,
      valoare: s.valoare,
    }));

    await facturiStore.addFactura({
      ...form.value,
      servicii: cleanedServicii,
      fisier: fisierData,
    });

    emit("success");
    emit("close");
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

calculateTotals();
</script>
