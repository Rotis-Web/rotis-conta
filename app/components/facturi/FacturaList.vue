<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6"
      >
        <h2 class="text-2xl font-bold text-gray-900">
          Facturi {{ tip === "emisa" ? "Emise" : "Primite" }}
        </h2>

        <button
          type="button"
          aria-label="Add"
          name="add"
          id="add"
          @click="showAddModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg
            class="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adaugă Factură
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-blue-800">Total Facturi</div>
          <div class="text-2xl font-bold text-blue-900">{{ totals.count }}</div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-green-800">Plătite</div>
          <div class="text-2xl font-bold text-green-900">
            {{ formatCurrency(totals.platite) }}
          </div>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-red-800">Neplătite</div>
          <div class="text-2xl font-bold text-red-900">
            {{ formatCurrency(totals.neplatite) }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="facturiStore.loading" class="p-6 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
        ></div>
      </div>

      <div
        v-else-if="filteredFacturi.length === 0"
        class="p-6 text-center text-gray-500"
      >
        Nu există facturi
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Număr
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Data
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Client
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="factura in filteredFacturi" :key="factura._id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ factura.serie ? factura.serie + "-" : ""
                }}{{ factura.numarFactura }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(factura.data) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ factura.client?.nume || "-" }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ formatCurrency(factura.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': factura.status === 'platita',
                    'bg-red-100 text-red-800': factura.status === 'neplatita',
                    'bg-yellow-100 text-yellow-800':
                      factura.status === 'partial',
                  }"
                >
                  {{ getStatusLabel(factura.status) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2"
              >
                <button
                  v-if="factura.fisier?.url"
                  @click="openFile(factura.fisier.url)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Descarcă
                </button>
                <button
                  @click="handleDelete(factura._id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Șterge
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalAddFactura
      v-if="showAddModal"
      :tip="tip"
      @close="showAddModal = false"
      @success="onAddSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const props = defineProps<{
  tip: "emisa" | "primita";
}>();

const facturiStore = useFacturiStore();
const showAddModal = ref(false);

const filteredFacturi = computed(() => {
  return facturiStore.facturedByTip(props.tip);
});

const totals = computed(() => {
  const filtered = filteredFacturi.value;
  const platite = filtered
    .filter((f) => f.status === "platita")
    .reduce((sum, f) => sum + (f.total || 0), 0);

  const neplatite = filtered
    .filter((f) => f.status === "neplatita")
    .reduce((sum, f) => sum + (f.total || 0), 0);

  return {
    count: filtered.length,
    platite,
    neplatite,
  };
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(amount);
};

const formatDate = (date: string | Date) => {
  return format(new Date(date), "dd.MM.yyyy", { locale: ro });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    platita: "Plătită",
    neplatita: "Neplătită",
    partial: "Parțial",
  };
  return labels[status] || status;
};

const openFile = (url: string) => {
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi această factură?")) {
    try {
      await facturiStore.deleteFactura(id);
    } catch (error) {
      console.error("Error deleting factura:", error);
      alert("Eroare la ștergere factură");
    }
  }
};

const onAddSuccess = () => {
  showAddModal.value = false;
};

onMounted(() => {
  facturiStore.fetchFacturi({ tip: props.tip });
});
</script>
