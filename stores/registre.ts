import { defineStore } from "pinia";
import type {
  IncasarePlata,
  IntrareIesire,
  RegistruInventar,
  TotalsMonthly,
  TotalsAnnual,
} from "../types";

interface RegistreState {
  incasariPlati: IncasarePlata[];
  ipTotals: TotalsAnnual;
  ipByMonth: TotalsMonthly[];
  ipSelectedYear: number;
  ipInitialized: boolean;

  intrareIesire: IntrareIesire[];
  iiSelectedYear: number;
  iiInitialized: boolean;

  registruInventar: RegistruInventar[];
  inventarTotals: {
    valoareContabila: number;
    valoareCirculatie: number;
    diferenteValoare: number;
  };
  inventarSelectedYear: number;
  inventarInitialized: boolean;

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

    registruInventar: [],
    inventarTotals: {
      valoareContabila: 0,
      valoareCirculatie: 0,
      diferenteValoare: 0,
    },
    inventarSelectedYear: new Date().getFullYear(),
    inventarInitialized: false,

    loading: false,
  }),

  getters: {
    currentYearIncasariPlati: (state) => state.incasariPlati,
    incasariPlatiTotals: (state) => state.ipTotals,
    incasariPlatiByMonth: (state) => state.ipByMonth,

    currentYearIntrareIesire: (state) => state.intrareIesire,

    currentYearInventar: (state) => state.registruInventar,
    inventarTotalsGetter: (state) => state.inventarTotals,
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
          (a: IncasarePlata, b: IncasarePlata) => {
            const dateA = new Date(a.data).getTime();
            const dateB = new Date(b.data).getTime();

            if (dateA !== dateB) {
              return dateA - dateB;
            }

            return (a.nrCrt || 0) - (b.nrCrt || 0);
          }
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
      const { success, error: showError } = useToast();
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

        success("Înregistrare adăugată cu succes!");
        return data.entry;
      } catch (err: any) {
        const index = this.incasariPlati.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.incasariPlati.splice(index, 1);
        }
        this.recalculateTotals();
        const message =
          err.data?.message || err.message || "Eroare la adăugare";
        showError(message);
        throw new Error(message);
      }
    },

    async deleteIncasarePlata(id: string) {
      const { success, error: showError } = useToast();
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
        success("Înregistrare ștearsă cu succes!");
      } catch (err: any) {
        if (deleted) {
          this.incasariPlati.splice(index, 0, deleted);
          this.recalculateTotals();
        }
        const message =
          err.data?.message || err.message || "Eroare la ștergere";
        showError(message);
        throw new Error(message);
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
            const dateA = new Date(a.dataInregistrarii).getTime();
            const dateB = new Date(b.dataInregistrarii).getTime();

            if (dateA !== dateB) {
              return dateA - dateB;
            }

            const aNum = parseInt(a.nrInregistrare as any) || 0;
            const bNum = parseInt(b.nrInregistrare as any) || 0;
            return aNum - bNum;
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
      const { success, error: showError } = useToast();
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

        success("Înregistrare adăugată cu succes!");
        return data.entry;
      } catch (err: any) {
        const index = this.intrareIesire.findIndex((e) => e._id === tempId);
        if (index !== -1) {
          this.intrareIesire.splice(index, 1);
        }
        const message =
          err.data?.message || err.message || "Eroare la adăugare";
        showError(message);
        throw new Error(message);
      }
    },

    async deleteIntrareIesire(id: string) {
      const { success, error: showError } = useToast();
      const index = this.intrareIesire.findIndex((e) => e._id === id);
      const deleted = index !== -1 ? this.intrareIesire[index] : null;

      if (index !== -1) {
        this.intrareIesire.splice(index, 1);
      }

      try {
        await $fetch(`/api/registre/intrare-iesire/${id}`, {
          method: "DELETE",
        });
        success("Înregistrare ștearsă cu succes!");
      } catch (err: any) {
        if (deleted) {
          this.intrareIesire.splice(index, 0, deleted);
        }
        const message =
          err.data?.message || err.message || "Eroare la ștergere";
        showError(message);
        throw new Error(message);
      }
    },

    changeIntrareIesireYear(year: number) {
      this.iiSelectedYear = year;
      this.iiInitialized = false;
      return this.fetchIntrareIesire(year);
    },

    async fetchInventar(an?: number, force = false) {
      const year = an || this.inventarSelectedYear;

      if (
        this.inventarInitialized &&
        year === this.inventarSelectedYear &&
        !force
      ) {
        return;
      }

      this.loading = true;
      this.inventarSelectedYear = year;

      try {
        const data = await $fetch<{
          entries: RegistruInventar[];
          totals: {
            valoareContabila: number;
            valoareCirculatie: number;
            diferenteValoare: number;
          };
        }>("/api/registre/inventar", {
          params: { an: year },
        });

        this.registruInventar = data.entries.sort(
          (a: RegistruInventar, b: RegistruInventar) => {
            const dateA = new Date(a.data).getTime();
            const dateB = new Date(b.data).getTime();

            if (dateA !== dateB) {
              return dateA - dateB;
            }

            return (a.nrCrt || 0) - (b.nrCrt || 0);
          }
        );

        this.inventarTotals = data.totals;
        this.inventarInitialized = true;
      } catch (err) {
        console.error("Error fetching inventar:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addInventar(entryData: Partial<RegistruInventar>) {
      const { success, error: showError } = useToast();
      const tempId = `temp-${Date.now()}`;
      const tempEntry: RegistruInventar = {
        ...entryData,
        _id: tempId,
        nrCrt: this.registruInventar.length + 1,
        data: entryData.data || new Date().toISOString(),
      } as RegistruInventar;

      this.registruInventar.push(tempEntry);
      this.recalculateInventarTotals();

      try {
        const data = await $fetch<{
          success: boolean;
          entry: RegistruInventar;
        }>("/api/registre/inventar", {
          method: "POST",
          body: entryData,
        });

        const index = this.registruInventar.findIndex(
          (e: { _id: string }) => e._id === tempId
        );
        if (index !== -1) {
          this.registruInventar[index] = data.entry;
        }

        success("Element inventar adăugat cu succes!");
        return data.entry;
      } catch (err: any) {
        const index = this.registruInventar.findIndex(
          (e: { _id: string }) => e._id === tempId
        );
        if (index !== -1) {
          this.registruInventar.splice(index, 1);
        }
        this.recalculateInventarTotals();
        const message =
          err.data?.message || err.message || "Eroare la adăugare";
        showError(message);
        throw new Error(message);
      }
    },

    async deleteInventar(id: string) {
      const { success, error: showError } = useToast();
      const index = this.registruInventar.findIndex(
        (e: { _id: string }) => e._id === id
      );
      const deleted = index !== -1 ? this.registruInventar[index] : null;

      if (index !== -1) {
        this.registruInventar.splice(index, 1);
        this.recalculateInventarTotals();
      }

      try {
        await $fetch(`/api/registre/inventar/${id}`, {
          method: "DELETE",
        });
        success("Element inventar șters cu succes!");
      } catch (err: any) {
        if (deleted) {
          this.registruInventar.splice(index, 0, deleted);
          this.recalculateInventarTotals();
        }
        const message =
          err.data?.message || err.message || "Eroare la ștergere";
        showError(message);
        throw new Error(message);
      }
    },

    changeInventarYear(year: number) {
      this.inventarSelectedYear = year;
      this.inventarInitialized = false;
      return this.fetchInventar(year);
    },

    recalculateInventarTotals() {
      const totals = this.registruInventar.reduce(
        (acc: any, entry: any) => {
          acc.valoareContabila += entry.valoareContabila || 0;
          acc.valoareCirculatie += entry.valoareCirculatie || 0;
          acc.diferenteValoare += entry.diferenteEvaluare?.valoare || 0;
          return acc;
        },
        {
          valoareContabila: 0,
          valoareCirculatie: 0,
          diferenteValoare: 0,
        }
      );

      this.inventarTotals = totals;
    },
  },
});
