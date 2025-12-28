import { defineStore } from "pinia";
import type {
  IncasarePlata,
  IntrareIesire,
  TotalsMonthly,
  TotalsAnnual,
} from "../types";

interface RegistreState {
  // Incasari-Plati
  incasariPlati: IncasarePlata[];
  ipTotals: TotalsAnnual;
  ipByMonth: TotalsMonthly[];
  ipSelectedYear: number;
  ipInitialized: boolean;

  // Intrare-Iesire
  intrareIesire: IntrareIesire[];
  iiSelectedYear: number;
  iiInitialized: boolean;

  loading: boolean;
}

export const useRegistreStore = defineStore("registre", {
  state: (): RegistreState => ({
    incasariPlati: [],
    ipTotals: { incasari: 0, plati: 0, sold: 0 },
    ipByMonth: [],
    ipSelectedYear: new Date().getFullYear(),
    ipInitialized: false,

    intrareIesire: [],
    iiSelectedYear: new Date().getFullYear(),
    iiInitialized: false,

    loading: false,
  }),

  getters: {
    currentYearIncasariPlati: (state) => state.incasariPlati,
    incasariPlatiTotals: (state) => state.ipTotals,
    incasariPlatiByMonth: (state) => state.ipByMonth,

    currentYearIntrareIesire: (state) => state.intrareIesire,
  },

  actions: {
    async fetchIncasariPlati(an?: number, luna?: number, force = false) {
      const year = an || this.ipSelectedYear;

      if (this.ipInitialized && year === this.ipSelectedYear && !force) {
        return;
      }

      this.loading = true;
      this.ipSelectedYear = year;

      try {
        const params: any = { an: year };
        if (luna) params.luna = luna;

        const data = await $fetch<{
          entries: IncasarePlata[];
          totals: TotalsAnnual;
          byMonth: TotalsMonthly[];
        }>("/api/registre/incasari-plati", { params });

        this.incasariPlati = data.entries.sort(
          (a: IncasarePlata, b: IncasarePlata) =>
            (a.nrCrt || 0) - (b.nrCrt || 0)
        );
        this.ipTotals = data.totals;
        this.ipByMonth = data.byMonth;
        this.ipInitialized = true;
      } catch (err) {
        console.error("Error fetching incasari-plati:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addIncasarePlata(entryData: Partial<IncasarePlata>) {
      const tempId = `temp-${Date.now()}`;
      const tempEntry: IncasarePlata = {
        ...entryData,
        _id: tempId,
        nrCrt: this.incasariPlati.length + 1,
        data: entryData.data || new Date().toISOString(),
      } as IncasarePlata;

      this.incasariPlati.push(tempEntry);
      this.recalculateTotals();

      try {
        const data = await $fetch<{ success: boolean; entry: IncasarePlata }>(
          "/api/registre/incasari-plati",
          {
            method: "POST",
            body: entryData,
          }
        );

        const index = this.incasariPlati.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.incasariPlati[index] = data.entry;
        }

        return data.entry;
      } catch (err: any) {
        const index = this.incasariPlati.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.incasariPlati.splice(index, 1);
        }
        this.recalculateTotals();
        throw new Error(
          err.data?.message || err.message || "Eroare la adăugare"
        );
      }
    },

    async deleteIncasarePlata(id: string) {
      const index = this.incasariPlati.findIndex((e) => e._id === id);
      const deleted = index !== -1 ? this.incasariPlati[index] : null;

      if (index !== -1) {
        this.incasariPlati.splice(index, 1);
        this.recalculateTotals();
      }

      try {
        await $fetch(`/api/registre/incasari-plati/${id}`, {
          method: "DELETE",
        });
      } catch (err: any) {
        if (deleted) {
          this.incasariPlati.splice(index, 0, deleted);
          this.recalculateTotals();
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la ștergere"
        );
      }
    },

    changeIncasariPlatiYear(year: number) {
      this.ipSelectedYear = year;
      this.ipInitialized = false;
      return this.fetchIncasariPlati(year);
    },

    recalculateTotals() {
      const incasari = this.incasariPlati
        .filter((e) => e.tip === "incasare")
        .reduce((sum, e) => sum + (e.suma || 0), 0);

      const plati = this.incasariPlati
        .filter((e) => e.tip === "plata")
        .reduce((sum, e) => sum + (e.suma || 0), 0);

      this.ipTotals = {
        incasari,
        plati,
        sold: incasari - plati,
      };
    },

    async fetchIntrareIesire(an?: number, force = false) {
      const year = an || this.iiSelectedYear;

      if (this.iiInitialized && year === this.iiSelectedYear && !force) {
        return;
      }

      this.loading = true;
      this.iiSelectedYear = year;

      try {
        const data = await $fetch<{ entries: IntrareIesire[] }>(
          "/api/registre/intrare-iesire",
          {
            params: { an: year },
          }
        );

        this.intrareIesire = data.entries.sort(
          (a: IntrareIesire, b: IntrareIesire) => {
            const aNum = parseInt(a.nrInregistrare || (0 as any));
            const bNum = parseInt(b.nrInregistrare || (0 as any));
            if (!isNaN(aNum) && !isNaN(bNum)) {
              return aNum - bNum;
            }
            return (
              new Date(a.dataInregistrarii).getTime() -
              new Date(b.dataInregistrarii).getTime()
            );
          }
        );

        this.iiInitialized = true;
      } catch (err) {
        console.error("Error fetching intrare-iesire:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addIntrareIesire(entryData: Partial<IntrareIesire>) {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempEntry: IntrareIesire = {
        ...entryData,
        _id: tempId,
        dataInregistrarii:
          entryData.dataInregistrarii || new Date().toISOString(),
      } as IntrareIesire;

      this.intrareIesire.push(tempEntry);

      try {
        const data = await $fetch<{ success: boolean; entry: IntrareIesire }>(
          "/api/registre/intrare-iesire",
          {
            method: "POST",
            body: entryData,
          }
        );

        const index = this.intrareIesire.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.intrareIesire[index] = data.entry;
        }

        return data.entry;
      } catch (err: any) {
        // Revert on error
        const index = this.intrareIesire.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.intrareIesire.splice(index, 1);
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la adăugare"
        );
      }
    },

    async deleteIntrareIesire(id: string) {
      const index = this.intrareIesire.findIndex((e) => e._id === id);
      const deleted = index !== -1 ? this.intrareIesire[index] : null;

      if (index !== -1) {
        this.intrareIesire.splice(index, 1);
      }

      try {
        await $fetch(`/api/registre/intrare-iesire/${id}`, {
          method: "DELETE",
        });
      } catch (err: any) {
        if (deleted) {
          this.intrareIesire.splice(index, 0, deleted);
        }
        throw new Error(
          err.data?.message || err.message || "Eroare la ștergere"
        );
      }
    },

    changeIntrareIesireYear(year: number) {
      this.iiSelectedYear = year;
      this.iiInitialized = false;
      return this.fetchIntrareIesire(year);
    },
  },
});
