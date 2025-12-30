const TAX_THRESHOLDS = {
  SALARIU_MINIM_BRUT: 3700,

  get CAS_PRAG() {
    return this.SALARIU_MINIM_BRUT * 12;
  },

  get CASS_PRAG() {
    return this.SALARIU_MINIM_BRUT * 12;
  },

  CAS_RATE: 0.25,
  CASS_RATE: 0.1,
  IMPOZIT_RATE: 0.1,
};

export const useCalculatorTaxe = () => {
  const calculate = (venit: number, cheltuieli: number) => {
    const baza = Math.max(0, venit - cheltuieli);

    let cas = 0;
    let casApplicabil = false;
    if (venit >= TAX_THRESHOLDS.CAS_PRAG) {
      cas = baza * TAX_THRESHOLDS.CAS_RATE;
      casApplicabil = true;
    }

    let cass = 0;
    let cassApplicabil = false;
    if (venit >= TAX_THRESHOLDS.CASS_PRAG) {
      cass = baza * TAX_THRESHOLDS.CASS_RATE;
      cassApplicabil = true;
    }

    const impozit = baza * TAX_THRESHOLDS.IMPOZIT_RATE;

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
      pragCas: TAX_THRESHOLDS.CAS_PRAG,
      pragCass: TAX_THRESHOLDS.CASS_PRAG,
      salariuMinim: TAX_THRESHOLDS.SALARIU_MINIM_BRUT,
    };
  };

  const calculateFromIncasariPlati = async (year: number) => {
    try {
      const { data } = await useFetch("/api/registre/incasari-plati", {
        params: { an: year },
      });

      if (data.value) {
        const venit = (data.value as any).totals.incasari;
        const cheltuieli = (data.value as any).totals.plati;
        return calculate(venit, cheltuieli);
      }
      return null;
    } catch (error) {
      console.error("Error calculating from registru:", error);
      return null;
    }
  };

  return {
    calculate,
    calculateFromIncasariPlati,
    thresholds: TAX_THRESHOLDS,
  };
};
