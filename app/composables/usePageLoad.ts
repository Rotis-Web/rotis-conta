export const usePageLoad = () => {
  const pageLoadingStore = usePageLoadingStore();

  const finishLoading = () => {
    pageLoadingStore.stopLoading();
  };

  onMounted(() => {
    nextTick(() => {
      if (pageLoadingStore.isLoading) {
        finishLoading();
      }
    });
  });

  return {
    finishLoading,
  };
};
