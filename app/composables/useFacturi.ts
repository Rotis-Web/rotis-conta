export const useFacturi = () => {
  const facturiStore = useFacturiStore();

  const facturi = computed(() => facturiStore.facturi);
  const totals = computed(() => facturiStore.totals);
  const loading = computed(() => facturiStore.loading);
  const initialized = computed(() => facturiStore.initialized);

  const facturedByTip = (tip: "emisa" | "primita") => {
    return computed(() => facturiStore.facturedByTip(tip));
  };

  const fetchFacturi = async (
    filters?: {
      tip?: "emisa" | "primita";
      an?: number;
      status?: string;
    },
    force = false
  ) => {
    await facturiStore.fetchFacturi(filters, force);
  };

  const addFactura = async (facturaData: any) => {
    await facturiStore.addFactura(facturaData);
  };

  const updateFactura = async (id: string, facturaData: any) => {
    await facturiStore.updateFactura(id, facturaData);
  };

  const deleteFactura = async (id: string) => {
    await facturiStore.deleteFactura(id);
  };

  return {
    facturi,
    totals,
    loading,
    initialized,
    facturedByTip,
    fetchFacturi,
    addFactura,
    updateFactura,
    deleteFactura,
  };
};
