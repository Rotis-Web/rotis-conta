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
      const { success, error: showError } = useToast();
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
        success("Autentificare reușită!");
        return data;
      } catch (err: any) {
        const message =
          err.data?.message || err.message || "Eroare la autentificare";
        showError(message);
        throw new Error(message);
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
      const { success, error: showError } = useToast();
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
        success("Cont creat cu succes!");
        return data;
      } catch (err: any) {
        const message =
          err.data?.message || err.message || "Eroare la înregistrare";
        showError(message);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const { info } = useToast();
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
        info("Te-ai deconectat cu succes");
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
      const { success, error: showError } = useToast();
      try {
        const data = await $fetch<{ pfaData: any }>("/api/auth/update-pfa", {
          method: "PUT",
          body: { pfaData },
        });
        if (this.user) {
          this.user.pfaData = data.pfaData;
        }
        success("Date PFA actualizate cu succes!");
        return data;
      } catch (err: any) {
        const message =
          err.data?.message || err.message || "Eroare la actualizare date PFA";
        showError(message);
        throw new Error(message);
      }
    },

    async updateProfile(profileData: { nume: string; email: string }) {
      const { success, error: showError } = useToast();
      try {
        const data = await $fetch<{ user: User }>("/api/auth/update-profile", {
          method: "PUT",
          body: profileData,
        });
        this.user = data.user;
        success("Profil actualizat cu succes!");
        return data;
      } catch (err: any) {
        const message =
          err.data?.message || err.message || "Eroare la actualizare profil";
        showError(message);
        throw new Error(message);
      }
    },

    async updatePassword(passwordData: {
      currentPassword: string;
      newPassword: string;
    }) {
      const { success, error: showError } = useToast();
      try {
        const data = await $fetch<{ success: boolean; message: string }>(
          "/api/auth/update-password",
          {
            method: "PUT",
            body: passwordData,
          }
        );
        success("Parola a fost schimbată cu succes!");
        return data;
      } catch (err: any) {
        const message =
          err.data?.message || err.message || "Eroare la schimbarea parolei";
        showError(message);
        throw new Error(message);
      }
    },

    async deleteAccount() {
      const { success, error: showError } = useToast();
      this.loading = true;

      try {
        await $fetch("/api/auth/delete-account", {
          method: "DELETE",
          credentials: "include",
        });

        this.user = null;
        this.initialized = false;

        const facturiStore = useFacturiStore();
        const registreStore = useRegistreStore();
        const documentsStore = useDocumentsStore();

        facturiStore.$reset();
        registreStore.$reset();
        documentsStore.$reset();

        success("Contul a fost șters");
        navigateTo("/login");
      } catch (err: any) {
        const message =
          err.data?.message ||
          err.message ||
          "A apărut o eroare la ștergerea contului";
        showError(message);
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
  },
});
