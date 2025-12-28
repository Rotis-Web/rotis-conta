<template>
  <div class="space-y-4">
    <div v-if="documentsStore.loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
      ></div>
    </div>
    <div
      v-else-if="filteredDocuments.length === 0"
      class="text-center py-8 text-gray-500 w-full"
    >
      Nu există documente
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="doc in filteredDocuments"
        :key="doc._id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <div class="flex items-center space-x-3">
          <svg
            class="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <div class="font-medium text-gray-900">{{ doc.titlu }}</div>
            <div class="text-sm text-gray-500">
              {{ doc.descriere }}
              <span v-if="doc.data"> • {{ formatDate(doc.data) }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <a
            v-if="doc.fisier?.url"
            :href="doc.fisier.url"
            target="_blank"
            class="p-2 text-blue-600 hover:text-blue-900"
            title="Descarcă"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
          <button
            @click="handleDelete(doc._id)"
            class="p-2 text-red-600 hover:text-red-900"
            title="Șterge"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const props = defineProps<{
  tip: string;
}>();

const documentsStore = useDocumentsStore();

const filteredDocuments = computed(() => {
  return documentsStore.documentsByTip(props.tip);
});

const formatDate = (date: string | Date) => {
  return format(new Date(date), "dd.MM.yyyy", { locale: ro });
};

const handleDelete = async (id: string) => {
  if (confirm("Sigur vrei să ștergi acest document?")) {
    try {
      await documentsStore.deleteDocument(id);
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Eroare la ștergere document");
    }
  }
};

onMounted(() => {
  documentsStore.fetchDocuments(props.tip);
});
</script>
