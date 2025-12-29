<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">
      Calculator CAS, CASS, Impozit
    </h2>

    <div class="space-y-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <label class="block text-sm font-medium text-blue-900 mb-2">
          Calculează din registrul de încasări și plăți
        </label>
        <div class="flex space-x-4">
          <CustomDropdown
            v-model="selectedYear"
            :options="
              years.map((year) => ({ label: year.toString(), value: year }))
            "
            class="w-32"
            @update:modelValue="calculateFromRegistru"
          />
          <button
            type="button"
            id="calculate"
            aria-label="Calculate"
            @click="calculateFromRegistru"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Calculează
          </button>
        </div>
      </div>

      <div class="text-center text-gray-500">SAU</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="venit" class="block text-sm font-medium text-gray-700">
            Venit Brut (RON)
          </label>
          <input
            id="venit"
            name="venit"
            v-model.number="manualInput.venit"
            type="number"
            step="0.01"
            min="0"
            @input="calculateManual"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div>
          <label
            for="cheltuieli"
            class="block text-sm font-medium text-gray-700"
          >
            Cheltuieli Deductibile (RON)
          </label>
          <input
            id="cheltuieli"
            name="cheltuieli"
            v-model.number="manualInput.cheltuieli"
            type="number"
            step="0.01"
            min="0"
            @input="calculateManual"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          />
        </div>
      </div>
    </div>

    <div v-if="result" class="space-y-4">
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Rezultate Calcul</h3>

        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm font-medium text-gray-700">Venit Brut:</span>
            <span class="text-sm font-bold text-gray-900">{{
              formatCurrency(result.venit)
            }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm font-medium text-gray-700">Cheltuieli:</span>
            <span class="text-sm font-bold text-gray-900">{{
              formatCurrency(result.cheltuieli)
            }}</span>
          </div>

          <div class="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span class="text-sm font-medium text-blue-800"
              >Bază Impozabilă:</span
            >
            <span class="text-sm font-bold text-blue-900">{{
              formatCurrency(result.baza)
            }}</span>
          </div>

          <div class="border-t border-gray-200 pt-2 space-y-2">
            <div
              class="flex justify-between items-center p-3 bg-orange-50 rounded"
            >
              <span class="text-sm font-medium text-orange-800"
                >CAS (25%):</span
              >
              <span class="text-sm font-bold text-orange-900">{{
                formatCurrency(result.cas)
              }}</span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-purple-50 rounded"
            >
              <span class="text-sm font-medium text-purple-800"
                >CASS (10%):</span
              >
              <span class="text-sm font-bold text-purple-900">{{
                formatCurrency(result.cass)
              }}</span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-red-50 rounded"
            >
              <span class="text-sm font-medium text-red-800"
                >Impozit pe Venit (10%):</span
              >
              <span class="text-sm font-bold text-red-900">{{
                formatCurrency(result.impozit)
              }}</span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-red-100 rounded"
            >
              <span class="text-base font-bold text-red-800"
                >TOTAL DE PLATĂ:</span
              >
              <span class="text-base font-bold text-red-900">{{
                formatCurrency(result.total)
              }}</span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-green-50 rounded"
            >
              <span class="text-base font-bold text-green-800"
                >Profit Net:</span
              >
              <span class="text-base font-bold text-green-900">{{
                formatCurrency(result.net)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg">
        <div class="text-sm text-yellow-800">
          <p class="font-medium mb-2">ℹ️ Informații importante:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>CAS: 25% din baza impozabilă (contribuție la pensie)</li>
            <li>CASS: 10% din baza impozabilă (contribuție la sănătate)</li>
            <li>Impozit pe venit: 10% din baza impozabilă</li>
            <li>Aceste procente sunt valabile pentru PFA în sistem real</li>
            <li>Consultați un contabil pentru cazuri specifice</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { calculate, calculateFromIncasariPlati } = useCalculatorTaxe();

const selectedYear = ref(new Date().getFullYear());
const manualInput = ref({
  venit: 0,
  cheltuieli: 0,
});
const result = ref<any>(null);

const years = computed(() => {
  const years = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear();
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
});

const calculateFromRegistru = async () => {
  const data = await calculateFromIncasariPlati(selectedYear.value);
  if (data) {
    result.value = data;
    manualInput.value.venit = data.venit;
    manualInput.value.cheltuieli = data.cheltuieli;
  }
};

const calculateManual = () => {
  result.value = calculate(
    manualInput.value.venit,
    manualInput.value.cheltuieli
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(amount);
};
</script>
