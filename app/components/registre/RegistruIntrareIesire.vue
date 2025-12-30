<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Registru de Intrare-Ieșire
        </h2>

        <div class="flex items-center flex-wrap gap-4">
          <div class="w-25">
            <CustomDropdown
              v-model="currentYear"
              :options="yearOptions"
              @update:modelValue="onYearChange"
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
            Adaugă înregistrare
          </button>

          <button
            @click="handleExport"
            type="button"
            name="exportExcel"
            id="exportExcel"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-600">
        Total înregistrări {{ currentYear }}:
        <span class="font-semibold">{{ totalEntries }}</span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-6 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
        ></div>
      </div>

      <div v-else-if="totalEntries === 0" class="p-6 text-center text-gray-500">
        Nu există înregistrări pentru anul {{ currentYear }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nr. Înreg.
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data înregistrării
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nr. și data documentului
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Emitent
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Conținutul pe scurt
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Compartiment
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data expedierii
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Destinatar
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template
              v-for="(item, index) in entriesWithMonthlyTotals"
              :key="item.id"
            >
              <tr v-if="item.isMonthTotal" class="bg-purple-50 font-semibold">
                <td colspan="2" class="px-6 py-3 text-sm text-purple-900">
                  Total {{ item.monthName }}
                </td>
                <td colspan="6" class="px-6 py-3 text-sm text-purple-700">
                  Număr înregistrări: {{ item.count }}
                </td>
                <td class="px-6 py-3"></td>
              </tr>

              <tr v-else class="hover:bg-gray-50">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ item.nrCrt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(item.dataInregistrarii) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="item.nrSiDataDocument">
                    <div>Nr: {{ item.nrSiDataDocument.numar }}</div>
                    <div class="text-xs text-gray-400">
                      {{ formatDate(item.nrSiDataDocument.data) }}
                    </div>
                  </div>
                  <div v-else class="text-gray-400">-</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.emitent || "-" }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div class="line-clamp-2" :title="item.continutPeScurt">
                    {{ item.continutPeScurt }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ item.compartimentSiSemnatura || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{
                    item.dataExpedierii ? formatDate(item.dataExpedierii) : "-"
                  }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ item.destinatar || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
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
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <ModalAddIntrareIesire
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
const { isOpen, openModal, closeModal } = useUploadModal();
const { exportIntrareIesireCSV } = useExportCSV();
const { finishLoading } = usePageLoad();

const currentYear = ref(registreStore.iiSelectedYear);
const loading = computed(() => registreStore.loading);

const totalEntries = computed(() => registreStore.intrareIesire.length);

const availableYears = computed(() => {
  const years = [];
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

const entriesWithMonthlyTotals = computed(() => {
  const entries = registreStore.intrareIesire;
  if (entries.length === 0) return [];

  const result: any[] = [];
  let currentMonth: number | null = null;
  let monthlyCount = 0;
  let nrCrt = 1;

  entries.forEach((entry: any, index: number) => {
    const entryDate = new Date(entry.dataInregistrarii);
    const entryMonth = entryDate.getMonth() + 1;

    if (currentMonth !== null && currentMonth !== entryMonth) {
      result.push({
        id: `total-${currentMonth}`,
        isMonthTotal: true,
        monthName: getMonthName(currentMonth),
        count: monthlyCount,
      });

      monthlyCount = 0;
    }

    currentMonth = entryMonth;

    result.push({
      ...entry,
      id: entry._id,
      nrCrt: nrCrt++,
      isMonthTotal: false,
    });

    monthlyCount++;

    if (index === entries.length - 1) {
      result.push({
        id: `total-${currentMonth}`,
        isMonthTotal: true,
        monthName: getMonthName(currentMonth),
        count: monthlyCount,
      });
    }
  });

  return result;
});

const formatDate = (date: string | Date) => {
  if (!date) return "-";
  return format(new Date(date), "dd.MM.yyyy", { locale: ro });
};

const getMonthName = (month: number) => {
  const months = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];
  return months[month - 1];
};

const onYearChange = async () => {
  await registreStore.changeIntrareIesireYear(currentYear.value);
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi această înregistrare?")) {
    try {
      await registreStore.deleteIntrareIesire(id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Eroare la ștergere");
    }
  }
};

const onAddSuccess = () => {
  closeModal();
};

const handleExport = () => {
  exportIntrareIesireCSV(registreStore.intrareIesire, currentYear.value);
};

onMounted(async () => {
  try {
    if (!registreStore.iiInitialized) {
      await registreStore.fetchIntrareIesire(currentYear.value);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    finishLoading();
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
