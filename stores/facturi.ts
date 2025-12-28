import { defineStore } from "pinia";
import type { Factura } from "../types";

interface FacturiState {
  facturi: Factura[];
  loading: boolean;
  initialized: boolean;
  currentFilters: {
    tip?: "emisa" | "primita";
    an?: number;
    status?: string;
  };
}

export const useFacturiStore = defineStore("facturi", {
  state: (): FacturiState => ({
    facturi: [],
    loading: false,
    initialized: false,
    currentFilters: {},
  }),

  getters: {
    totals: (state) => {
      const platite = state.facturi
        .filter((f) => f.status === "platita")
        .reduce((sum, f) => sum + (f.total || 0), 0);

      const neplatite = state.facturi
        .filter((f) => f.status === "neplatita")
        .reduce((sum, f) => sum + (f.total || 0), 0);

      const total = state.facturi.reduce((sum, f) => sum + (f.total || 0), 0);

      return {
        total,
        platite,
        neplatite,
        count: state.facturi.length,
      };
    },

    facturedByTip: (state) => (tip: "emisa" | "primita") => {
      return state.facturi.filter((f) => f.tip === tip);
    },
  },

  actions: {
    async fetchFacturi(
      filters?: {
        tip?: "emisa" | "primita";
        an?: number;
        status?: string;
      },
      force = false
    ) {
      const filtersChanged =
        JSON.stringify(filters) !== JSON.stringify(this.currentFilters);

      if (this.initialized && !filtersChanged && !force) {
        return;
      }

      this.loading = true;
      this.currentFilters = filters || {};

      try {
        const data = await $fetch<{
          facturi: Factura[];
          totals: any;
        }>("/api/facturi", {
          params: filters,
        });

        this.facturi = data.facturi.sort((a: Factura, b: Factura) => {
          return new Date(b.data).getTime() - new Date(a.data).getTime();
        });

        this.initialized = true;
      } catch (err: any) {
        console.error("Error fetching facturi:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addFactura(facturaData: Partial<Factura>) {
      const tempId = `temp-${Date.now()}`;
      const tempFactura: Factura = {
        ...facturaData,
        _id: tempId,
        data: facturaData.data || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Factura;

      this.facturi.unshift(tempFactura);

      try {
        const data = await $fetch<{ success: boolean; factura: Factura }>(
          "/api/facturi",
          {
            method: "POST",
            body: facturaData,
          }
        );

        const index = this.facturi.findIndex((f) => f._id === tempId);
        if (index !== -1) {
          this.facturi[index] = data.factura;
        }

        return data.factura;
      } catch (err: any) {
        const index = this.facturi.findIndex((f) => f._id === tempId);
        if (index !== -1) {
          this.facturi.splice(index, 1);
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la adăugare factură"
        );
      }
    },

    async updateFactura(id: string, facturaData: Partial<Factura>) {
      // Optimistic update
      const index = this.facturi.findIndex((f) => f._id === id);
      const oldData = index !== -1 ? { ...this.facturi[index] } : null;

      if (index !== -1) {
        this.facturi[index] = { ...this.facturi[index], ...facturaData };
      }

      try {
        const data = await $fetch<{ success: boolean; factura: Factura }>(
          `/api/facturi/${id}`,
          {
            method: "PUT",
            body: facturaData,
          }
        );

        if (index !== -1) {
          this.facturi[index] = data.factura;
        }

        return data.factura;
      } catch (err: any) {
        // Revert on error
        if (index !== -1 && oldData) {
          this.facturi[index] = oldData;
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la actualizare factură"
        );
      }
    },

    async deleteFactura(id: string) {
      // Optimistic update
      const index = this.facturi.findIndex((f) => f._id === id);
      const deleted = index !== -1 ? this.facturi[index] : null;

      if (index !== -1) {
        this.facturi.splice(index, 1);
      }

      try {
        await $fetch(`/api/facturi/${id}`, { method: "DELETE" });
      } catch (err: any) {
        // Revert on error
        if (deleted) {
          this.facturi.splice(index, 0, deleted);
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la ștergere factură"
        );
      }
    },
  },
});
