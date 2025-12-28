export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.fetchUser();
  }

  if (authStore.isAuthenticated) {
    return navigateTo("/dashboard");
  }
});
