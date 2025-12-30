export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.fetchUser();
  }

  const protectedRoutes = [
    "/dashboard",
    "/registre",
    "/facturi",
    "/documente",
    "/calculator",
    "/setari",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  );

  if (isProtectedRoute && !authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
