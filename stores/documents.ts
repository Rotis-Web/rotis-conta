import { defineStore } from "pinia";
import type { Document } from "../types";

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  uploading: boolean;
  initialized: boolean;
  currentTip: string | null;
}

export const useDocumentsStore = defineStore("documents", {
  state: (): DocumentsState => ({
    documents: [],
    loading: false,
    uploading: false,
    initialized: false,
    currentTip: null,
  }),

  getters: {
    documentsByTip: (state) => (tip: string) => {
      return state.documents.filter((d) => d.tip === tip);
    },

    totalDocuments: (state) => state.documents.length,
  },

  actions: {
    async fetchDocuments(tip?: string, force = false) {
      if (this.initialized && tip === this.currentTip && !force) {
        return;
      }

      this.loading = true;
      this.currentTip = tip || null;

      try {
        const params = tip ? { tip } : {};
        const data = await $fetch<{ documents: Document[]; total?: number }>(
          "/api/documents",
          { params }
        );

        this.documents = data.documents || [];
        this.initialized = true;
      } catch (err) {
        console.error("Error fetching documents:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async uploadDocument(
      file: File,
      metadata: {
        tip: string;
        titlu: string;
        descriere?: string;
        data?: string;
      }
    ) {
      const { success, error: showError } = useToast();
      this.uploading = true;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tip", metadata.tip);
        formData.append("titlu", metadata.titlu);
        if (metadata.descriere)
          formData.append("descriere", metadata.descriere);
        if (metadata.data) formData.append("data", metadata.data);

        const data = await $fetch<{ success: boolean; document: Document }>(
          "/api/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        this.documents.unshift(data.document);
        success("Document încărcat cu succes!");
        return data.document;
      } catch (err: any) {
        const message = err.data?.message || err.message || "Eroare la upload";
        showError(message);
        throw new Error(message);
      } finally {
        this.uploading = false;
      }
    },

    async deleteDocument(id: string) {
      const { success, error: showError } = useToast();
      const index = this.documents.findIndex((d) => d._id === id);
      const deleted = index !== -1 ? this.documents[index] : null;

      if (index !== -1) {
        this.documents.splice(index, 1);
      }

      try {
        await $fetch(`/api/documents/${id}`, { method: "DELETE" });
        success("Document șters cu succes!");
      } catch (err: any) {
        if (deleted) {
          this.documents.splice(index, 0, deleted);
        }
        const message =
          err.data?.message || err.message || "Eroare la ștergere document";
        showError(message);
        throw new Error(message);
      }
    },
  },
});
