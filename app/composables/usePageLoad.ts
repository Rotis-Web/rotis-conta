export const usePageLoad = () => {
  const pageLoadingStore = usePageLoadingStore();

  const finishLoading = () => {
    pageLoadingStore.stopLoading();
  };

  onBeforeUnmount(() => {
    if (pageLoadingStore.isLoading) {
      finishLoading();
    }
  });

  return {
    finishLoading,
  };
};
