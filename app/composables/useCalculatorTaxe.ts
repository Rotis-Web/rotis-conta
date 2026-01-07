const MIN_WAGE_BY_YEAR: Record<number, number> = {
  2024: 3300,
  2025: 4050,
};

export type CassExemption =
  | "none" // Fără exceptare
  | "student" // Elev/Student
  | "pensioner" // Pensionar
  | "employed" // Angajat (asigurat prin CIM)
  | "parental_leave" // Concediu creștere copil
  | "other"; // Alte cazuri prevăzute de lege

export type TaxThresholds = {
  year: number;
  SALARIU_MINIM_BRUT: number;
  CAS_PRAG_12: number;
  CAS_PRAG_24: number;
  CASS_MIN_BASE: number;
  CASS_MAX_BASE: number;
  CAS_RATE: number;
  CASS_RATE: number;
  IMPOZIT_RATE: number;
};

export type TaxResult = {
  venit: number;
  cheltuieli: number;
  baza: number;
  bazaImpozit: number;
  cas: number;
  cass: number;
  impozit: number;
  total: number;
  net: number;
  casApplicabil: boolean;
  cassApplicabil: boolean;
  cassExempted: boolean;
  cassExemptionReason?: string;
  salariuMinim: number;
  pragCas12: number;
  pragCas24: number;
  cassMinBase: number;
  cassMaxBase: number;
  casBase: number;
  cassBase: number;
  year: number;
};

const getThresholds = (year: number): TaxThresholds => {
  const SALARIU_MINIM_BRUT =
    MIN_WAGE_BY_YEAR[year] ?? MIN_WAGE_BY_YEAR[2025] ?? 4050;

  return {
    year,
    SALARIU_MINIM_BRUT,
    CAS_PRAG_12: SALARIU_MINIM_BRUT * 12,
    CAS_PRAG_24: SALARIU_MINIM_BRUT * 24,
    CASS_MIN_BASE: SALARIU_MINIM_BRUT * 6,
    CASS_MAX_BASE: SALARIU_MINIM_BRUT * 60,
    CAS_RATE: 0.25,
    CASS_RATE: 0.1,
    IMPOZIT_RATE: 0.1,
  };
};

const getCassExemptionLabel = (exemption: CassExemption): string => {
  const labels: Record<CassExemption, string> = {
    none: "Fără exceptare",
    student: "Elev/Student",
    pensioner: "Pensionar",
    employed: "Angajat cu CIM",
    parental_leave: "Concediu creștere copil",
    other: "Alte cazuri legale",
  };
  return labels[exemption];
};

const getCassExemptionOptions = () => {
  const exemptions: CassExemption[] = [
    "none",
    "student",
    "pensioner",
    "employed",
    "parental_leave",
    "other",
  ];

  return exemptions.map((exemption) => ({
    label: getCassExemptionLabel(exemption),
    value: exemption,
  }));
};

export const useCalculatorTaxe = () => {
  const { success, error: showError } = useToast();
  const calculating = ref(false);

  const thresholdsFor = (year: number) => getThresholds(year);

  const calculate = (
    venit: number,
    cheltuieli: number,
    year: number,
    cassExemption: CassExemption = "none"
  ): TaxResult => {
    const t = getThresholds(year);

    const baza = Math.max(0, venit - cheltuieli);

    // Calcul CAS
    let cas = 0;
    let casApplicabil = false;
    let casBase = 0;

    if (baza >= t.CAS_PRAG_12) {
      casApplicabil = true;
      casBase = baza >= t.CAS_PRAG_24 ? t.CAS_PRAG_24 : t.CAS_PRAG_12;
      cas = casBase * t.CAS_RATE;
    }

    let cass = 0;
    let cassApplicabil = false;
    let cassBase = 0;
    let cassExempted = cassExemption !== "none";
    let cassExemptionReason: string | undefined;

    if (baza > 0) {
      cassApplicabil = true;
      if (cassExempted) {
        cassBase = baza;
        cass = cassBase * t.CASS_RATE;
        cassExemptionReason = getCassExemptionLabel(cassExemption);
      } else {
        cassBase = Math.min(Math.max(baza, t.CASS_MIN_BASE), t.CASS_MAX_BASE);
        cass = cassBase * t.CASS_RATE;
      }
    }

    const bazaImpozit = Math.max(0, baza - cas - cass);
    const impozit = bazaImpozit * t.IMPOZIT_RATE;
    const total = cas + cass + impozit;
    const net = baza - total;

    return {
      venit,
      cheltuieli,
      baza,
      bazaImpozit,
      cas,
      cass,
      impozit,
      total,
      net,
      casApplicabil,
      cassApplicabil,
      cassExempted,
      cassExemptionReason,
      salariuMinim: t.SALARIU_MINIM_BRUT,
      pragCas12: t.CAS_PRAG_12,
      pragCas24: t.CAS_PRAG_24,
      cassMinBase: t.CASS_MIN_BASE,
      cassMaxBase: t.CASS_MAX_BASE,
      casBase,
      cassBase,
      year: t.year,
    };
  };

  const calculateFromIncasariPlati = async (
    year: number,
    cassExemption: CassExemption = "none"
  ) => {
    calculating.value = true;
    try {
      const { data } = await useFetch("/api/registre/incasari-plati", {
        params: { an: year },
      });

      if (!data.value) {
        showError("Nu s-au găsit date pentru anul selectat");
        return null;
      }

      const venit = (data.value as any).totals.incasari;
      const cheltuieli = (data.value as any).totals.plati;

      const result = calculate(venit, cheltuieli, year, cassExemption);
      success("Calculul a fost realizat cu succes!");
      return result;
    } catch (err) {
      console.error("Error calculating from registru:", err);
      showError("Eroare la calcularea impozitelor");
      return null;
    } finally {
      calculating.value = false;
    }
  };

  return {
    calculate,
    calculateFromIncasariPlati,
    thresholdsFor,
    calculating,
  };
};
