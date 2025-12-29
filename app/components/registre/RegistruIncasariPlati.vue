<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div
        class="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Registru Încasări și Plăți
        </h2>

        <div class="flex items-center space-x-4">
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
            <tr v-for="entry in registreStore.incasariPlati" :key="entry._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ entry.nrCrt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(entry.data) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ entry.document?.tip }} {{ entry.document?.numar }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ entry.felulOperatiunii }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600"
              >
                {{
                  entry.tip === "incasare" ? formatCurrency(entry.suma) : "-"
                }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600"
              >
                {{ entry.tip === "plata" ? formatCurrency(entry.suma) : "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="handleDelete(entry._id)"
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

const registreStore = useRegistreStore();
const { isOpen, openModal, closeModal } = useUploadModal();
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

onMounted(async () => {
  if (!registreStore.ipInitialized) {
    await registreStore.fetchIncasariPlati(currentYear.value);
  }
});
</script>
