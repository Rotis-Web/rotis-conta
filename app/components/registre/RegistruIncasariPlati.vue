<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Registru Încasări și Plăți
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
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-green-800">Total Încasări</div>
          <div class="text-2xl font-bold text-green-900">
            {{ formatCurrency(registreStore.ipTotals.incasari) }}
          </div>
        </div>

        <div class="bg-red-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-red-800">Total Plăți</div>
          <div class="text-2xl font-bold text-red-900">
            {{ formatCurrency(registreStore.ipTotals.plati) }}
          </div>
        </div>

        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-sm font-medium text-blue-800">Sold</div>
          <div class="text-2xl font-bold text-blue-900">
            {{ formatCurrency(registreStore.ipTotals.sold) }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Raport Lunar {{ currentYear }}
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Luna
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Încasări
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Plăți
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sold
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="month in registreStore.ipByMonth" :key="month.luna">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ getMonthName(month.luna) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                {{ formatCurrency(month.incasari) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                {{ formatCurrency(month.plati) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                :class="month.sold >= 0 ? 'text-blue-600' : 'text-red-600'"
              >
                {{ formatCurrency(month.sold) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
      >
        <h3 class="text-lg font-medium text-gray-900">
          Toate Înregistrările ({{ entriesCount }})
        </h3>
        <button
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
        Nu există înregistrări pentru anul {{ currentYear }}
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
                Document
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Felul Operațiunii
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Metodă
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Încasări
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Plăți
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
              <tr v-if="item.isMonthTotal" class="bg-indigo-50 font-semibold">
                <td colspan="3" class="px-6 py-3 text-sm text-indigo-900">
                  Total {{ item.monthName }}
                </td>
                <td class="px-6 py-3"></td>
                <td class="px-6 py-3"></td>
                <td class="px-6 py-3 text-sm text-green-700">
                  {{ formatCurrency(item.incasari) }}
                </td>
                <td class="px-6 py-3 text-sm text-red-700">
                  {{ formatCurrency(item.plati) }}
                </td>
                <td class="px-6 py-3 text-sm text-blue-700">
                  Sold: {{ formatCurrency(item.sold) }}
                </td>
              </tr>

              <tr v-else>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.nrCrt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(item.data) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.document?.tip }} {{ item.document?.numar }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ item.felulOperatiunii }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      item.metodaPlata === 'banca'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    "
                  >
                    {{ item.metodaPlata === "banca" ? "Bancă" : "Numerar" }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600"
                >
                  {{
                    item.tip === "incasare" ? formatCurrency(item.suma) : "-"
                  }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600"
                >
                  {{ item.tip === "plata" ? formatCurrency(item.suma) : "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
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

    <ModalAddIncasarePlata
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
const { exportIncasariPlatiCSV } = useExportCSV();
const { finishLoading } = usePageLoad();

const currentYear = ref(registreStore.ipSelectedYear);

const entriesCount = computed(() => registreStore.incasariPlati.length);

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

const entriesWithMonthlyTotals = computed(() => {
  const entries = registreStore.incasariPlati;
  if (entries.length === 0) return [];

  const result: any[] = [];
  let currentMonth: number | null = null;
  let monthlyIncasari = 0;
  let monthlyPlati = 0;
  let nrCrt = 1;

  entries.forEach((entry, index) => {
    const entryDate = new Date(entry.data);
    const entryMonth = entryDate.getMonth() + 1;

    if (currentMonth !== null && currentMonth !== entryMonth) {
      result.push({
        id: `total-${currentMonth}`,
        isMonthTotal: true,
        monthName: getMonthName(currentMonth),
        incasari: monthlyIncasari,
        plati: monthlyPlati,
        sold: monthlyIncasari - monthlyPlati,
      });

      monthlyIncasari = 0;
      monthlyPlati = 0;
    }

    currentMonth = entryMonth;

    result.push({
      ...entry,
      id: entry._id,
      nrCrt: nrCrt++,
      isMonthTotal: false,
    });

    if (entry.tip === "incasare") {
      monthlyIncasari += entry.suma;
    } else {
      monthlyPlati += entry.suma;
    }

    if (index === entries.length - 1) {
      result.push({
        id: `total-${currentMonth}`,
        isMonthTotal: true,
        monthName: getMonthName(currentMonth),
        incasari: monthlyIncasari,
        plati: monthlyPlati,
        sold: monthlyIncasari - monthlyPlati,
      });
    }
  });

  return result;
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
  await registreStore.changeIncasariPlatiYear(currentYear.value);
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi această înregistrare?")) {
    try {
      await registreStore.deleteIncasarePlata(id);
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Eroare la ștergere");
    }
  }
};

const onAddSuccess = async () => {
  closeModal();
  registreStore.recalculateTotals();
};

const refreshData = async () => {
  await registreStore.fetchIncasariPlati(currentYear.value, undefined, true);
};

const handleExport = () => {
  exportIncasariPlatiCSV(
    registreStore.incasariPlati,
    currentYear.value,
    registreStore.ipTotals
  );
};

onMounted(async () => {
  try {
    if (!registreStore.ipInitialized) {
      await registreStore.fetchIncasariPlati(currentYear.value);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    finishLoading();
  }
});
</script>
