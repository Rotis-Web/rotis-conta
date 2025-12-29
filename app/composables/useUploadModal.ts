export const useUploadModal = () => {
  const isOpen = ref(false);

  const openModal = () => {
    isOpen.value = true;

    if (process.client) {
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    isOpen.value = false;

    if (process.client) {
      document.body.style.overflow = "";
    }
  };

  onUnmounted(() => {
    if (process.client) {
      document.body.style.overflow = "";
    }
  });

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
