<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-6">
    <h2 class="text-xl md:text-2xl font-bold text-gray-900">
      Calculator CAS, CASS, Impozit
    </h2>

    <div class="space-y-4">
      <div class="bg-purple-50 p-4 rounded-lg">
        <label class="block text-sm font-medium text-purple-900 mb-2">
          Statut contribuabil CASS
        </label>
        <CustomDropdown
          v-model="cassExemption"
          :options="cassExemptionOptions"
          class="w-full md:w-96"
        />
        <p class="text-xs text-purple-700 mt-2">
          💡 Dacă ești elev, student, pensionar sau ai alt statut care te
          scutește, selectează opțiunea corespunzătoare pentru a nu plăti
          plafonul minim CASS.
        </p>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="block text-sm font-medium text-blue-900 mb-2">
          Calculează din registrul de încasări și plăți
        </p>
        <div class="flex space-x-4">
          <CustomDropdown
            v-model="selectedYear"
            :options="years.map((y) => ({ label: y.toString(), value: y }))"
            class="w-25"
          />
          <button
            type="button"
            id="calculate"
            name="calculate"
            aria-label="Calculate"
            @click="calculateFromRegistru"
            :disabled="calculating"
            class="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="calculating">Se calculează...</span>
            <span v-else>Calculează</span>
          </button>
        </div>
      </div>

      <div class="text-center text-gray-500">SAU</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="venit">
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
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700"
            for="cheltuieli"
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
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
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
            <span class="text-sm font-bold text-gray-900">
              {{ formatCurrency(result.venit) }}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="text-sm font-medium text-gray-700">Cheltuieli:</span>
            <span class="text-sm font-bold text-gray-900">
              {{ formatCurrency(result.cheltuieli) }}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span class="text-sm font-medium text-blue-800"
              >Bază Impozabilă:</span
            >
            <span class="text-sm font-bold text-blue-900">
              {{ formatCurrency(result.baza) }}
            </span>
          </div>

          <div class="border-t border-gray-200 pt-2 space-y-2">
            <div
              class="flex justify-between items-center p-3 rounded"
              :class="result.casApplicabil ? 'bg-orange-50' : 'bg-gray-100'"
            >
              <div class="flex flex-col">
                <span
                  class="text-sm font-medium"
                  :class="
                    result.casApplicabil ? 'text-orange-800' : 'text-gray-600'
                  "
                >
                  CAS (25%):
                </span>

                <span
                  v-if="!result.casApplicabil"
                  class="text-xs text-gray-500"
                >
                  Sub pragul de {{ formatCurrency(result.pragCas12) }} (12×
                  salariul minim)
                </span>

                <span v-else class="text-xs text-orange-700">
                  Bază CAS folosită: {{ formatCurrency(result.casBase) }}
                </span>
              </div>

              <span
                class="text-sm font-bold"
                :class="
                  result.casApplicabil ? 'text-orange-900' : 'text-gray-600'
                "
              >
                {{ formatCurrency(result.cas) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-3 rounded"
              :class="
                result.cassExempted
                  ? 'bg-green-50'
                  : result.cassApplicabil
                  ? 'bg-purple-50'
                  : 'bg-gray-100'
              "
            >
              <div class="flex flex-col">
                <span
                  class="text-sm font-medium"
                  :class="
                    result.cassExempted
                      ? 'text-green-800'
                      : result.cassApplicabil
                      ? 'text-purple-800'
                      : 'text-gray-600'
                  "
                >
                  CASS (10%):
                </span>

                <span v-if="result.cassExempted" class="text-xs text-green-700">
                  {{ result.cassExemptionReason }} - CASS din baza reală:
                  {{ formatCurrency(result.cassBase) }}
                </span>

                <span
                  v-else-if="result.cassApplicabil"
                  class="text-xs text-purple-700"
                >
                  Bază CASS (încadrată 6×..60×):
                  {{ formatCurrency(result.cassBase) }}
                </span>

                <span v-else class="text-xs text-gray-500"
                  >Nu se aplică (bază 0)</span
                >
              </div>

              <span
                class="text-sm font-bold"
                :class="
                  result.cassExempted
                    ? 'text-green-900'
                    : result.cassApplicabil
                    ? 'text-purple-900'
                    : 'text-gray-600'
                "
              >
                {{ formatCurrency(result.cass) }}
              </span>
            </div>

            <div
              v-if="result.bazaImpozit !== result.baza"
              class="flex justify-between items-center p-3 bg-blue-50 rounded"
            >
              <span class="text-sm font-medium text-blue-800">
                Bază Impozit (după CAS/CASS):
              </span>
              <span class="text-sm font-bold text-blue-900">
                {{ formatCurrency(result.bazaImpozit) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-red-50 rounded"
            >
              <span class="text-sm font-medium text-red-800">
                Impozit pe Venit (10%):
              </span>
              <span class="text-sm font-bold text-red-900">
                {{ formatCurrency(result.impozit) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-red-100 rounded"
            >
              <span class="text-base font-bold text-red-800"
                >TOTAL DE PLATĂ:</span
              >
              <span class="text-base font-bold text-red-900">
                {{ formatCurrency(result.total) }}
              </span>
            </div>

            <div
              class="flex justify-between items-center p-3 bg-green-50 rounded"
            >
              <span class="text-base font-bold text-green-800"
                >Profit Net:</span
              >
              <span class="text-base font-bold text-green-900">
                {{ formatCurrency(result.net) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg">
        <div class="text-sm text-yellow-800">
          <p class="font-medium mb-2">ℹ️ Informații importante:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>
              <strong>CAS (25%):</strong> Se datorează dacă venitul net anual
              (venit − cheltuieli) depășește
              {{ formatCurrency(result.pragCas12) }} (12× salariul minim). Baza
              CAS este 12× sau 24× ({{ formatCurrency(result.pragCas24) }}) în
              funcție de venit.
            </li>
            <li>
              <strong>CASS (10%):</strong>
              <span v-if="result.cassExempted">
                Ca {{ result.cassExemptionReason?.toLowerCase() }}, plătești
                CASS de 10% din venitul net real ({{
                  formatCurrency(result.baza)
                }}), fără plafonul minim de 6× salariul minim.
              </span>
              <span v-else>
                Se calculează la o bază încadrată între
                {{ formatCurrency(result.cassMinBase) }} (6×) și
                {{ formatCurrency(result.cassMaxBase) }} (60×), în funcție de
                venitul net anual.
              </span>
            </li>
            <li>
              <strong>Impozit pe venit (10%):</strong> Se aplică pe baza
              impozabilă DUPĂ scăderea CAS și CASS ({{
                formatCurrency(result.bazaImpozit)
              }}).
            </li>
            <li>
              Pragurile afișate sunt pentru anul selectat:
              <strong>{{ selectedYear }}</strong
              >.
            </li>
            <li>
              Salariul minim brut (an selectat):
              {{ formatCurrency(result.salariuMinim) }}/lună
            </li>
            <li>
              <strong
                >Consultați un contabil pentru cazuri specifice și actualizări
                legislative.</strong
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassExemption } from "~/composables/useCalculatorTaxe";

definePageMeta({ middleware: "auth" });

const { calculate, calculateFromIncasariPlati, thresholdsFor, calculating } =
  useCalculatorTaxe();
const { finishLoading } = usePageLoad();

const selectedYear = ref(new Date().getFullYear());
const cassExemption = ref<CassExemption>("none");
const manualInput = ref({ venit: 0, cheltuieli: 0 });
const result = ref<any>(null);

const years = computed(() => {
  const arr: number[] = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear();
  for (let y = endYear; y >= startYear; y--) arr.push(y);
  return arr;
});

const cassExemptionOptions = [
  { label: "Fără exceptare", value: "none" },
  { label: "Elev/Student", value: "student" },
  { label: "Pensionar", value: "pensioner" },
  { label: "Angajat cu CIM", value: "employed" },
  { label: "Concediu creștere copil", value: "parental_leave" },
  { label: "Alte cazuri legale", value: "other" },
];

const thresholds = computed(() => thresholdsFor(selectedYear.value));

const calculateFromRegistru = async () => {
  const data = await calculateFromIncasariPlati(
    selectedYear.value,
    cassExemption.value
  );
  if (data) {
    result.value = data;
    manualInput.value.venit = data.venit;
    manualInput.value.cheltuieli = data.cheltuieli;
  }
};

const calculateManual = () => {
  result.value = calculate(
    manualInput.value.venit,
    manualInput.value.cheltuieli,
    selectedYear.value,
    cassExemption.value
  );
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(
    amount
  );

watch(cassExemption, () => {
  if (result.value) {
    calculateManual();
  }
});

onMounted(() => {
  finishLoading();
});
</script>
