export const useRegistreIncasariPlati = () => {
  const registreStore = useRegistreStore();

  const entries = computed(() => registreStore.incasariPlati);
  const totals = computed(() => registreStore.ipTotals);
  const byMonth = computed(() => registreStore.ipByMonth);
  const selectedYear = computed(() => registreStore.ipSelectedYear);
  const loading = computed(() => registreStore.loading);

  const fetchEntries = async (year?: number, month?: number, force = false) => {
    await registreStore.fetchIncasariPlati(year, month, force);
  };

  const addEntry = async (entryData: any) => {
    await registreStore.addIncasarePlata(entryData);
  };

  const deleteEntry = async (id: string) => {
    await registreStore.deleteIncasarePlata(id);
  };

  const changeYear = (year: number) => {
    return registreStore.changeIncasariPlatiYear(year);
  };

  return {
    entries,
    totals,
    byMonth,
    selectedYear,
    loading,
    fetchEntries,
    addEntry,
    deleteEntry,
    changeYear,
  };
};
