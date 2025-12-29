<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Încarcă Document</h3>
    <form @submit.prevent="handleUpload" class="space-y-4">
      <div v-if="!tip">
        <label class="block text-sm font-medium text-gray-700">
          Tip Document *
        </label>
        <select
          id="tip"
          name="tip"
          v-model="form.tip"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        >
          <option value="">Selectează</option>
          <option value="contract">Contract</option>
          <option value="extras">Extras de cont</option>
          <option value="declaratie">Declarație</option>
          <option value="plata">Plăți și impozite</option>
          <option value="factura-emisa">Factură emisă</option>
          <option value="factura-primita">Factură primită</option>
          <option value="divers">Divers</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"> Titlu * </label>
        <input
          id="title"
          name="title"
          v-model="form.titlu"
          type="text"
          required
          placeholder="Numele documentului"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Descriere (opțional)
        </label>
        <input
          id="descriere"
          name="descriere"
          v-model="form.descriere"
          type="text"
          placeholder="Descriere scurtă"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"> Data </label>
        <input
          id="data"
          name="data"
          v-model="form.data"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Fișier *
        </label>
        <input
          id="file"
          name="file"
          ref="fileInput"
          type="file"
          required
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          @change="handleFileChange"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
      <button
        type="submit"
        id="submit"
        aria-label="Submit"
        name="submit"
        :disabled="documentsStore.uploading"
        class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
      >
        {{ documentsStore.uploading ? "Se încarcă..." : "Încarcă Document" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tip?: string;
}>();

const documentsStore = useDocumentsStore();
const emit = defineEmits(["success"]);

const form = ref({
  tip: props.tip || "",
  titlu: "",
  descriere: "",
  data: new Date().toISOString().split("T")[0],
});

const fileInput = ref<HTMLInputElement>();
const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  try {
    await documentsStore.uploadDocument(selectedFile.value, {
      tip: form.value.tip,
      titlu: form.value.titlu,
      descriere: form.value.descriere || undefined,
      data: form.value.data || undefined,
    });
    emit("success");

    // Reset form
    form.value = {
      tip: props.tip || "",
      titlu: "",
      descriere: "",
      data: new Date().toISOString().split("T")[0],
    };
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Eroare la încărcare document");
  }
};

// Update form.tip when prop changes
watch(
  () => props.tip,
  (newTip) => {
    if (newTip) {
      form.value.tip = newTip;
    }
  },
  { immediate: true }
);
</script>
