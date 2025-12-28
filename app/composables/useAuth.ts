export const useAuth = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const loading = computed(() => authStore.loading);

  const fetchUser = async () => {
    if (authStore.initialized) {
      return;
    }
    await authStore.fetchUser();
  };

  const login = async (email: string, password: string) => {
    await authStore.login(email, password);
  };

  const register = async (formData: any) => {
    await authStore.register(formData);
  };

  const logout = async () => {
    await authStore.logout();
  };

  return {
    user,
    isAuthenticated,
    loading,
    fetchUser,
    login,
    register,
    logout,
  };
};
