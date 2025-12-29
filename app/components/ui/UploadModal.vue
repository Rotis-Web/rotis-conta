<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition-transform duration-300"
          enter-from-class="translate-y-full md:translate-y-0 md:scale-95"
          enter-to-class="translate-y-0 md:scale-100"
          leave-active-class="transition-transform duration-300"
          leave-from-class="translate-y-0 md:scale-100"
          leave-to-class="translate-y-full md:translate-y-0 md:scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white w-full md:w-full md:max-w-lg md:rounded-lg h-full md:h-auto max-h-screen overflow-y-auto"
          >
            <div
              class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10"
            >
              <h3 class="text-lg font-semibold text-gray-900">
                Încarcă Document
              </h3>
              <button
                @click="closeModal"
                type="button"
                name="close"
                id="close"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-6">
              <form @submit.prevent="handleUpload" class="space-y-4">
                <div v-if="!tip">
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="tip"
                  >
                    Tip Document *
                  </label>
                  <select
                    v-model="form.tip"
                    name="tip"
                    id="tip"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selectează</option>
                    <option value="contract">Contract</option>
                    <option value="extras">Extras de cont</option>
                    <option value="declaratie">Declarație</option>
                    <option value="plati-impozite">Plăți și impozite</option>
                    <option value="factura-emisa">Factură emisă</option>
                    <option value="factura-primita">Factură primită</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="titlu"
                  >
                    Titlu *
                  </label>
                  <input
                    v-model="form.titlu"
                    type="text"
                    name="titlu"
                    id="titlu"
                    required
                    placeholder="Numele documentului"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="descriere"
                  >
                    Descriere (opțional)
                  </label>
                  <input
                    v-model="form.descriere"
                    type="text"
                    name="descriere"
                    id="descriere"
                    placeholder="Descriere scurtă"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="data"
                  >
                    Data
                  </label>
                  <input
                    v-model="form.data"
                    type="date"
                    name="data"
                    id="data"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 mb-1"
                    for="file"
                  >
                    Fișier *
                  </label>
                  <input
                    ref="fileInput"
                    type="file"
                    required
                    name="file"
                    id="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    @change="handleFileChange"
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <div class="pt-4">
                  <button
                    type="submit"
                    id="submit"
                    aria-label="Submit"
                    name="submit"
                    :disabled="documentsStore.uploading"
                    class="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {{
                      documentsStore.uploading
                        ? "Se încarcă..."
                        : "Încarcă Document"
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  tip?: string;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const documentsStore = useDocumentsStore();

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

const closeModal = () => {
  emit("close");
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
    closeModal();

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
