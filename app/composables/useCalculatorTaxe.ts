const MIN_WAGE_BY_YEAR: Record<number, number> = {
  2024: 3300,
  2025: 4050,
};

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

  cas: number;
  cass: number;
  impozit: number;
  total: number;
  net: number;

  casApplicabil: boolean;
  cassApplicabil: boolean;

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

export const useCalculatorTaxe = () => {
  const thresholdsFor = (year: number) => getThresholds(year);

  const calculate = (
    venit: number,
    cheltuieli: number,
    year: number
  ): TaxResult => {
    const t = getThresholds(year);

    const baza = Math.max(0, venit - cheltuieli);

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

    if (baza > 0) {
      cassApplicabil = true;
      cassBase = Math.min(Math.max(baza, t.CASS_MIN_BASE), t.CASS_MAX_BASE);
      cass = cassBase * t.CASS_RATE;
    }

    const impozit = baza * t.IMPOZIT_RATE;
    const total = cas + cass + impozit;
    const net = baza - total;

    return {
      venit,
      cheltuieli,
      baza,

      cas,
      cass,
      impozit,
      total,
      net,

      casApplicabil,
      cassApplicabil,

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

  const calculateFromIncasariPlati = async (year: number) => {
    try {
      const { data } = await useFetch("/api/registre/incasari-plati", {
        params: { an: year },
      });

      if (!data.value) return null;

      const venit = (data.value as any).totals.incasari;
      const cheltuieli = (data.value as any).totals.plati;

      return calculate(venit, cheltuieli, year);
    } catch (error) {
      console.error("Error calculating from registru:", error);
      return null;
    }
  };

  return {
    calculate,
    calculateFromIncasariPlati,
    thresholdsFor,
  };
};
