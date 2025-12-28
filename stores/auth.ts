import { defineStore } from "pinia";
import type { User } from "../types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        const data = await $fetch<{ user: User; token: string }>(
          "/api/auth/login",
          {
            method: "POST",
            body: { email, password },
          }
        );
        this.user = data.user;
        this.initialized = true;
        return data;
      } catch (err: any) {
        throw new Error(
          err.data?.message || err.message || "Eroare la autentificare"
        );
      } finally {
        this.loading = false;
      }
    },

    async register(formData: {
      email: string;
      password: string;
      nume: string;
      pfaData?: any;
    }) {
      this.loading = true;
      try {
        const data = await $fetch<{ user: User; token: string }>(
          "/api/auth/register",
          {
            method: "POST",
            body: formData,
          }
        );
        this.user = data.user;
        this.initialized = true;
        return data;
      } catch (err: any) {
        throw new Error(
          err.data?.message || err.message || "Eroare la înregistrare"
        );
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.user = null;
        this.initialized = false;

        const facturiStore = useFacturiStore();
        const registreStore = useRegistreStore();
        const documentsStore = useDocumentsStore();
        facturiStore.$reset();
        registreStore.$reset();
        documentsStore.$reset();

        navigateTo("/login");
      }
    },

    async fetchUser() {
      if (process.server) {
        this.initialized = true;
        return;
      }

      if (this.initialized) {
        return;
      }

      this.loading = true;
      try {
        const data = await $fetch<{ user: User }>("/api/auth/me", {
          credentials: "include",
        });
        this.user = data.user;
        this.initialized = true;
      } catch (err: any) {
        if (err?.statusCode !== 401) {
          console.error("Failed to fetch user:", err);
        }
        this.user = null;
        this.initialized = true;
      } finally {
        this.loading = false;
      }
    },

    async updatePFAData(pfaData: any) {
      try {
        const data = await $fetch<{ pfaData: any }>("/api/auth/update-pfa", {
          method: "PUT",
          body: { pfaData },
        });
        if (this.user) {
          this.user.pfaData = data.pfaData;
        }
        return data;
      } catch (err: any) {
        throw new Error(
          err.data?.message || err.message || "Eroare la actualizare date PFA"
        );
      }
    },
  },
});
