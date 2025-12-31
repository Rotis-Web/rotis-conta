export const useRegistreInventar = () => {
  const registreStore = useRegistreStore();

  const entries = computed(() => registreStore.registruInventar);
  const totals = computed(() => registreStore.inventarTotals);
  const selectedYear = computed(() => registreStore.inventarSelectedYear);
  const loading = computed(() => registreStore.loading);

  const fetchEntries = async (year?: number, force = false) => {
    await registreStore.fetchInventar(year, force);
  };

  const addEntry = async (entryData: any) => {
    await registreStore.addInventar(entryData);
  };

  const deleteEntry = async (id: string) => {
    await registreStore.deleteInventar(id);
  };

  const changeYear = (year: number) => {
    return registreStore.changeInventarYear(year);
  };

  return {
    entries,
    totals,
    selectedYear,
    loading,
    fetchEntries,
    addEntry,
    deleteEntry,
    changeYear,
  };
};
