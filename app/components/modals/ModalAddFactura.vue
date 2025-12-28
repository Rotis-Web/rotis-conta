<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
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
                v-model="form.serie"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Număr *</label
              >
              <input
                v-model="form.numarFactura"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Data *</label
              >
              <input
                v-model="form.data"
                type="date"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  v-model="form.client.nume"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >CUI</label
                >
                <input
                  v-model="form.client.cui"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Adresă</label
                >
                <input
                  v-model="form.client.adresa"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-gray-900">Servicii</h4>
              <button
                type="button"
                @click="addService"
                class="text-sm text-indigo-600 hover:text-indigo-500"
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
                  v-model="serviciu.denumire"
                  type="text"
                  placeholder="Denumire"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  v-model.number="serviciu.cantitate"
                  type="number"
                  placeholder="Cant."
                  @input="calculateService(index)"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  v-model.number="serviciu.pretUnitar"
                  type="number"
                  step="0.01"
                  placeholder="Preț"
                  @input="calculateService(index)"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div class="flex items-center space-x-2">
                <input
                  :value="serviciu.valoare"
                  type="number"
                  disabled
                  class="block w-full rounded-md border-gray-300 bg-gray-50 sm:text-sm"
                />
                <button
                  type="button"
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
              v-model="form.status"
              required
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Anulează
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
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
  servicii: [{ denumire: "", cantitate: 1, pretUnitar: 0, valoare: 0 }],
  subtotal: 0,
  tva: 0,
  total: 0,
  status: "neplatita" as "platita" | "neplatita" | "partial",
  fisier: null as any,
});

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);
const loading = ref(false);
const error = ref("");

const addService = () => {
  form.value.servicii.push({
    denumire: "",
    cantitate: 1,
    pretUnitar: 0,
    valoare: 0,
  });
};

const removeService = (index: number) => {
  form.value.servicii.splice(index, 1);
  calculateTotals();
};

const calculateService = (index: number) => {
  const serviciu = form.value.servicii[index];
  serviciu.valoare = serviciu.cantitate * serviciu.pretUnitar;
  calculateTotals();
};

const calculateTotals = () => {
  form.value.subtotal = form.value.servicii.reduce(
    (sum, s) => sum + s.valoare,
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
    let fisierData = null;
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

    await facturiStore.addFactura({
      ...form.value,
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
