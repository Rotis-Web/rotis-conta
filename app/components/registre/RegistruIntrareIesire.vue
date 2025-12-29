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
              :options="
                availableYears.map((year) => ({
                  label: year.toString(),
                  value: year,
                }))
              "
              @update:modelValue="onYearChange"
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
            type="button"
            :disabled="loading"
            name="exportToExcel"
            id="exportToExcel"
            @click="exportToExcel"
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
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-600">
        Total înregistrări {{ currentYear }}:
        <span class="font-semibold">{{ entries.length }}</span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-6 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
        ></div>
      </div>

      <div
        v-else-if="entries.length === 0"
        class="p-6 text-center text-gray-500"
      >
        Nu există înregistrări pentru anul {{ currentYear }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nr. de înregistrare la care se conexează și indicatorul
                dosarului
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
                Conținutul pe scurt al documentului
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Compartimentul și semnătura de primire
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
            <tr
              v-for="entry in entries"
              :key="entry._id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ entry.nrInregistrare }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(entry.dataInregistrarii) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="entry.nrSiDataDocument">
                  <div>Nr: {{ entry.nrSiDataDocument.numar }}</div>
                  <div class="text-xs text-gray-400">
                    {{ formatDate(entry.nrSiDataDocument.data) }}
                  </div>
                </div>
                <div v-else class="text-gray-400">-</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ entry.emitent || "-" }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="line-clamp-2" :title="entry.continutPeScurt">
                  {{ entry.continutPeScurt }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ entry.compartimentSiSemnatura || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  entry.dataExpedierii ? formatDate(entry.dataExpedierii) : "-"
                }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ entry.destinatar || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
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

const {
  entries,
  loading,
  selectedYear,
  fetchEntries,
  deleteEntry,
  changeYear,
} = useRegistreIntrareIesire();

const { isOpen, openModal, closeModal } = useUploadModal();
const currentYear = ref(selectedYear.value);

const availableYears = computed(() => {
  const years = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear() + 1;
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
});

const formatDate = (date: string | Date) => {
  if (!date) return "-";
  return format(new Date(date), "dd.MM.yyyy", { locale: ro });
};

const onYearChange = () => {
  changeYear(currentYear.value);
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi această înregistrare?")) {
    await deleteEntry(id);
  }
};

const onAddSuccess = () => {
  closeModal();
};

const exportToExcel = () => {
  const headers = [
    "Nr. Înregistrare",
    "Data Înregistrării",
    "Nr. Document",
    "Data Document",
    "Emitent",
    "Conținut",
    "Compartiment",
    "Data Expedierii",
    "Destinatar",
  ];

  const rows = entries.value.map((entry: any) => [
    entry.nrInregistrare,
    formatDate(entry.dataInregistrarii),
    entry.nrSiDataDocument?.numar || "",
    entry.nrSiDataDocument?.data ? formatDate(entry.nrSiDataDocument.data) : "",
    entry.emitent || "",
    entry.continutPeScurt,
    entry.compartimentSiSemnatura || "",
    entry.dataExpedierii ? formatDate(entry.dataExpedierii) : "",
    entry.destinatar || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `registru-intrare-iesire-${currentYear.value}.csv`;
  link.click();
};

onMounted(() => {
  fetchEntries();
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
