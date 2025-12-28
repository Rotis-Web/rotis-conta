export const useCalculatorTaxe = () => {
  const calculate = (venit: number, cheltuieli: number) => {
    const baza = venit - cheltuieli;

    const cas = baza * 0.25;

    const cass = baza * 0.1;

    const impozit = baza * 0.1;

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
  };
};
