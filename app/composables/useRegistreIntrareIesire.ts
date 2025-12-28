export const useRegistreIntrareIesire = () => {
  const registreStore = useRegistreStore();

  const entries = computed(() => registreStore.intrareIesire);
  const selectedYear = computed(() => registreStore.iiSelectedYear);
  const loading = computed(() => registreStore.loading);

  const fetchEntries = async (year?: number, force = false) => {
    await registreStore.fetchIntrareIesire(year, force);
  };

  const addEntry = async (entryData: any) => {
    await registreStore.addIntrareIesire(entryData);
  };

  const deleteEntry = async (id: string) => {
    await registreStore.deleteIntrareIesire(id);
  };

  const changeYear = (year: number) => {
    return registreStore.changeIntrareIesireYear(year);
  };

  return {
    entries,
    selectedYear,
    loading,
    fetchEntries,
    addEntry,
    deleteEntry,
    changeYear,
  };
};
