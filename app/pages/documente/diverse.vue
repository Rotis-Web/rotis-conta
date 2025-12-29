<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Diverse</h2>
        <div class="w-25 lg:w-32">
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="order-1 md:order-2 md:sticky md:top-6 md:self-start">
          <UploadDocument tip="divers" />
        </div>

        <div class="md:col-span-2 order-2 md:order-1">
          <DocumentsList tip="divers" :year="selectedYear" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);

const availableYears = computed(() => {
  const years = [];
  for (let year = currentYear; year >= currentYear - 5; year--) {
    years.push(year);
  }
  return years;
});

const handleYearChange = (year: number) => {
  selectedYear.value = year;
};
</script>
