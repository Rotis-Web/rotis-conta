export const useDocuments = () => {
  const documentsStore = useDocumentsStore();

  const documents = computed(() => documentsStore.documents);
  const loading = computed(() => documentsStore.loading);
  const uploading = computed(() => documentsStore.uploading);
  const initialized = computed(() => documentsStore.initialized);

  const documentsByTip = (tip: string) => {
    return computed(() => documentsStore.documentsByTip(tip));
  };

  const fetchDocuments = async (tip?: string, force = false) => {
    await documentsStore.fetchDocuments(tip, force);
  };

  const uploadDocument = async (
    file: File,
    metadata: {
      tip: string;
      titlu: string;
      descriere?: string;
      data?: string;
    }
  ) => {
    await documentsStore.uploadDocument(file, metadata);
  };

  const deleteDocument = async (id: string) => {
    await documentsStore.deleteDocument(id);
  };

  return {
    documents,
    loading,
    uploading,
    initialized,
    documentsByTip,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
  };
};
