<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Extrase de Cont
        </h2>

        <div class="flex items-center gap-3">
          <button
            type="button"
            name="add"
            id="add"
            @click="openModal"
            class="md:hidden flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <svg
              class="w-4 h-4"
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
          </button>

          <div class="w-25">
            <CustomDropdown
              v-model="selectedYear"
              :options="
                availableYears.map((year) => ({
                  label: year.toString(),
                  value: year,
                }))
              "
              @change="handleYearChange"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="hidden md:block md:order-2 md:sticky md:top-6 md:self-start"
        >
          <UploadDocument tip="extras" @success="handleUploadSuccess" />
        </div>
        <div class="md:col-span-2 md:order-1">
          <DocumentsList tip="extras" :year="selectedYear" />
        </div>
      </div>
    </div>

    <UploadModal
      :is-open="isOpen"
      tip="extras"
      @close="closeModal"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const documentsStore = useDocumentsStore();
const { isOpen, openModal, closeModal } = useUploadModal();
const { finishLoading } = usePageLoad();

const availableYears = computed(() => {
  const years = [];
  for (let year = currentYear; year >= currentYear - 5; year--)
    years.push(year);
  return years;
});

const handleYearChange = (year: number) => {
  selectedYear.value = year;
};

const handleUploadSuccess = () => {
  documentsStore.fetchDocuments("extras", true);
};

onMounted(async () => {
  try {
    await documentsStore.fetchDocuments("extras");
  } catch (error) {
    console.error("Error loading documents:", error);
  } finally {
    finishLoading();
  }
});
</script>
