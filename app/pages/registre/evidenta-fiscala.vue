<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        Registru de Evidență Fiscală
      </h2>

      <div class="mb-6 space-y-4">
        <div class="w-25">
          <CustomDropdown
            v-model="selectedYear"
            :options="
              availableYears.map((year : number) => ({ label: year.toString(), value: year }))
            "
            @change="handleYearChange"
          />
        </div>

        <div class="bg-purple-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-purple-900 mb-2">
            Statut contribuabil CASS
          </label>
          <CustomDropdown
            v-model="cassExemption"
            :options="cassExemptionOptions"
            class="w-full md:w-96"
            @change="loadData"
          />
          <p class="text-xs text-purple-700 mt-2">
            💡 Selectează statutul tău pentru calculul corect al CASS
          </p>
        </div>
      </div>

      <div class="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">
          Raport Anual {{ selectedYear }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Venituri</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total venituri:</span>
                <span class="text-sm font-semibold">{{
                  formatCurrency(totals.venituri)
                }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">
              Cheltuieli Deductibile
            </h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total cheltuieli:</span>
                <span class="text-sm font-semibold">{{
                  formatCurrency(totals.cheltuieli)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-base font-medium text-gray-900">Profit Net:</span>
            <span class="text-xl font-bold text-green-600">{{
              formatCurrency(totals.profit)
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-6">
          Obligații Fiscale Estimate
        </h3>

        <div v-if="taxe" class="space-y-3">
          <div
            class="flex justify-between"
            :class="taxe.casApplicabil ? '' : 'opacity-50'"
          >
            <div class="flex flex-col">
              <span class="text-sm text-gray-700">CAS (25%):</span>
              <span v-if="!taxe.casApplicabil" class="text-xs text-gray-500">
                Nu se aplică (sub prag)
              </span>
            </div>
            <span class="text-sm font-semibold">{{
              formatCurrency(taxe.cas)
            }}</span>
          </div>

          <div
            class="flex justify-between"
            :class="
              taxe.cassExempted
                ? 'bg-green-100 p-2 rounded'
                : taxe.cassApplicabil
                ? ''
                : 'opacity-50'
            "
          >
            <div class="flex flex-col">
              <span
                class="text-sm"
                :class="
                  taxe.cassExempted
                    ? 'text-green-800 font-medium'
                    : 'text-gray-700'
                "
              >
                CASS (10%):
              </span>
              <span v-if="taxe.cassExempted" class="text-xs text-green-700">
                {{ taxe.cassExemptionReason }} - din baza reală
              </span>
              <span
                v-else-if="!taxe.cassApplicabil"
                class="text-xs text-gray-500"
              >
                Nu se aplică (sub prag)
              </span>
            </div>
            <span
              class="text-sm font-semibold"
              :class="taxe.cassExempted ? 'text-green-800' : ''"
            >
              {{ formatCurrency(taxe.cass) }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-sm text-gray-700">Impozit pe venit (10%):</span>
            <span class="text-sm font-semibold">{{
              formatCurrency(taxe.impozit)
            }}</span>
          </div>

          <div class="flex justify-between pt-3 border-t border-blue-200">
            <span class="text-base font-medium text-gray-900">Total taxe:</span>
            <span class="text-lg font-bold text-red-600">{{
              formatCurrency(taxe.total)
            }}</span>
          </div>
        </div>

        <div class="mt-4 text-xs text-gray-600 space-y-1">
          <p>
            * Calculele sunt orientative și țin cont de pragurile fiscale din
            {{ selectedYear }}.
          </p>
          <p v-if="taxe?.cassExempted">
            * Ca {{ taxe.cassExemptionReason?.toLowerCase() }}, CASS se
            calculează din venitul net real, fără plafonul minim de 6× salariul
            minim.
          </p>
          <p v-else>
            * CAS și CASS se calculează doar dacă venitul depășește pragurile
            legale.
          </p>
          <p>
            * Impozitul se calculează din baza rămasă după scăderea CAS și CASS.
          </p>
          <p>
            * Consultați un contabil pentru valori exacte și cazuri specifice.
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="handleExport"
          type="button"
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
  </div>
</template>

<script setup lang="ts">
import type { CassExemption } from "~/composables/useCalculatorTaxe";

definePageMeta({
  middleware: "auth",
});

const { finishLoading } = usePageLoad();
const { calculate } = useCalculatorTaxe();
const { exportEvidentaFiscalaCSV } = useExportCSV();

const selectedYear = ref(new Date().getFullYear());
const cassExemption = ref<CassExemption>("none");

const totals = ref({
  venituri: 0,
  cheltuieli: 0,
  profit: 0,
});

const taxe = ref<any>(null);

const availableYears = computed(() => {
  const years = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear();
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
});

const cassExemptionOptions = [
  { label: "Fără exceptare", value: "none" },
  { label: "Elev/Student", value: "student" },
  { label: "Pensionar", value: "pensioner" },
  { label: "Angajat cu CIM", value: "employed" },
  { label: "Concediu creștere copil", value: "parental_leave" },
  { label: "Alte cazuri legale", value: "other" },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(amount);
};

const loadData = async () => {
  try {
    const { data } = await useFetch("/api/registre/incasari-plati", {
      params: { an: selectedYear.value },
    });

    if (data.value) {
      totals.value.venituri = data.value.totals.incasari;
      totals.value.cheltuieli = data.value.totals.plati;
      totals.value.profit = totals.value.venituri - totals.value.cheltuieli;
      taxe.value = calculate(
        totals.value.venituri,
        totals.value.cheltuieli,
        selectedYear.value,
        cassExemption.value
      );
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    finishLoading();
  }
};

const handleExport = () => {
  if (taxe.value) {
    exportEvidentaFiscalaCSV(selectedYear.value, totals.value, taxe.value);
  }
};

const handleYearChange = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>
