<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Registru Inventar
        </h2>

        <div class="flex items-center flex-wrap gap-4">
          <div class="w-25">
            <CustomDropdown
              v-model="currentYear"
              :options="yearOptions"
              @change="onYearChange"
            />
          </div>

          <button
            type="button"
            name="add"
            id="add"
            @click="openModal"
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
            Adaugă element
          </button>

          <button
            @click="handleExport"
            type="button"
            name="exportExcel"
            id="exportExcel"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-blue-800">
            Valoare Contabilă Totală
          </div>
          <div class="text-2xl font-bold text-blue-900">
            {{ formatCurrency(registreStore.inventarTotals.valoareContabila) }}
          </div>
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-green-800">
            Valoare Circulație Totală
          </div>
          <div class="text-2xl font-bold text-green-900">
            {{ formatCurrency(registreStore.inventarTotals.valoareCirculatie) }}
          </div>
        </div>

        <div
          class="p-4 rounded-lg"
          :class="
            registreStore.inventarTotals.diferenteValoare >= 0
              ? 'bg-green-50'
              : 'bg-red-50'
          "
        >
          <div
            class="text-sm font-medium"
            :class="
              registreStore.inventarTotals.diferenteValoare >= 0
                ? 'text-green-800'
                : 'text-red-800'
            "
          >
            Diferențe de Evaluare
          </div>
          <div
            class="text-2xl font-bold"
            :class="
              registreStore.inventarTotals.diferenteValoare >= 0
                ? 'text-green-900'
                : 'text-red-900'
            "
          >
            {{
              formatCurrency(
                Math.abs(registreStore.inventarTotals.diferenteValoare)
              )
            }}
            <span class="text-sm">
              ({{
                registreStore.inventarTotals.diferenteValoare >= 0
                  ? "Plus"
                  : "Minus"
              }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
      >
        <h3 class="text-lg font-medium text-gray-900">
          Toate Elementele ({{ entriesCount }})
        </h3>
        <button
          type="button"
          name="refresh"
          id="refresh"
          @click="refreshData"
          class="text-sm text-indigo-600 hover:text-indigo-800"
          :disabled="registreStore.loading"
        >
          <svg
            class="h-5 w-5"
            :class="{ 'animate-spin': registreStore.loading }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div v-if="registreStore.loading" class="p-6 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
        ></div>
      </div>

      <div v-else-if="entriesCount === 0" class="p-6 text-center text-gray-500">
        Nu există elemente pentru anul {{ currentYear }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nr. Crt.
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Elementele Inventariate
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Valoare Contabilă
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Valoare Circulație
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Diferențe Evaluare
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cauze
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, index) in registreStore.registruInventar"
              :key="item._id"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.data) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 min-w-[300px]">
                {{ item.elementeInventariate }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium"
              >
                {{ formatCurrency(item.valoareContabila) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium"
              >
                {{ formatCurrency(item.valoareCirculatie) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                :class="
                  item.diferenteEvaluare.valoare >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ formatCurrency(Math.abs(item.diferenteEvaluare.valoare)) }}
                <span class="text-xs">
                  ({{ item.diferenteEvaluare.valoare >= 0 ? "+" : "-" }})
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ item.diferenteEvaluare.cauze || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  type="button"
                  name="delete"
                  id="delete"
                  @click="handleDelete(item._id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Șterge
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50 font-semibold">
            <tr>
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900">TOTAL</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                {{
                  formatCurrency(registreStore.inventarTotals.valoareContabila)
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                {{
                  formatCurrency(registreStore.inventarTotals.valoareCirculatie)
                }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="
                  registreStore.inventarTotals.diferenteValoare >= 0
                    ? 'text-green-700'
                    : 'text-red-700'
                "
              >
                {{
                  formatCurrency(
                    Math.abs(registreStore.inventarTotals.diferenteValoare)
                  )
                }}
                <span class="text-xs">
                  ({{
                    registreStore.inventarTotals.diferenteValoare >= 0
                      ? "+"
                      : "-"
                  }})
                </span>
              </td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <ModalAddInventar
      :is-open="isOpen"
      @close="closeModal"
      @success="onAddSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { ro } from "date-fns/locale";

definePageMeta({
  middleware: "auth",
});

const registreStore = useRegistreStore();
const { exportInventarCSV } = useExportCSV();
const { isOpen, openModal, closeModal } = useUploadModal();
const { finishLoading } = usePageLoad();

const currentYear = ref(registreStore.inventarSelectedYear);

const entriesCount = computed(() => registreStore.registruInventar.length);

const availableYears = computed(() => {
  const years: number[] = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear() + 1;
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
});

const yearOptions = computed(() => {
  return availableYears.value.map((year) => ({
    value: year,
    label: year.toString(),
  }));
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

const onYearChange = async () => {
  await registreStore.changeInventarYear(currentYear.value);
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi acest element?")) {
    try {
      await registreStore.deleteInventar(id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Eroare la ștergere");
    }
  }
};

const onAddSuccess = async () => {
  closeModal();
  registreStore.recalculateInventarTotals();
};

const refreshData = async () => {
  await registreStore.fetchInventar(currentYear.value, true);
};

const handleExport = () => {
  exportInventarCSV(
    registreStore.registruInventar,
    currentYear.value,
    registreStore.inventarTotals
  );
};

onMounted(async () => {
  try {
    if (!registreStore.inventarInitialized) {
      await registreStore.fetchInventar(currentYear.value);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    finishLoading();
  }
});
</script>
