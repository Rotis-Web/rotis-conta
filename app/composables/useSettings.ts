import type { PFAData } from "../../types";

export const useSettings = () => {
  const authStore = useAuthStore();
  const { error: showError } = useToast();

  const activeTab = ref<"pfa" | "account">("pfa");

  const pfaForm = ref<PFAData>({
    denumire: "",
    cui: "",
    nrRegCom: "",
    adresa: "",
    telefon: "",
    email: "",
    banca: "",
    iban: "",
    caen: "",
  });

  const accountForm = ref({
    nume: "",
    email: "",
  });

  const passwordForm = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const pfaLoading = ref(false);
  const accountLoading = ref(false);
  const passwordLoading = ref(false);

  const initializeForms = () => {
    if (authStore.user) {
      if (authStore.user.pfaData) {
        pfaForm.value = {
          denumire: authStore.user.pfaData.denumire || "",
          cui: authStore.user.pfaData.cui || "",
          nrRegCom: authStore.user.pfaData.nrRegCom || "",
          adresa: authStore.user.pfaData.adresa || "",
          telefon: authStore.user.pfaData.telefon || "",
          email: authStore.user.pfaData.email || "",
          banca: authStore.user.pfaData.banca || "",
          iban: authStore.user.pfaData.iban || "",
          caen: authStore.user.pfaData.caen || "",
        };
      }

      accountForm.value = {
        nume: authStore.user.nume,
        email: authStore.user.email,
      };
    }
  };

  const handlePFASubmit = async () => {
    pfaLoading.value = true;

    try {
      await authStore.updatePFAData(pfaForm.value);
    } catch (error: any) {
    } finally {
      pfaLoading.value = false;
    }
  };

  const handleAccountSubmit = async () => {
    accountLoading.value = true;

    try {
      await authStore.updateProfile({
        nume: accountForm.value.nume,
        email: accountForm.value.email,
      });
    } catch (error: any) {
    } finally {
      accountLoading.value = false;
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      showError("Parolele nu coincid!");
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      showError("Parola trebuie să aibă cel puțin 6 caractere!");
      return;
    }

    passwordLoading.value = true;

    try {
      await authStore.updatePassword({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      });

      passwordForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    } catch (error: any) {
    } finally {
      passwordLoading.value = false;
    }
  };

  const deleteConfirmText = ref("");
  const deleteLoading = ref(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.value !== "STERGE") return;

    if (!confirm("Sigur vrei să ștergi contul? Acțiunea este permanentă."))
      return;

    deleteLoading.value = true;
    try {
      await authStore.deleteAccount();
      await navigateTo("/login");
    } catch (e: any) {
    } finally {
      deleteLoading.value = false;
      deleteConfirmText.value = "";
    }
  };

  return {
    activeTab,
    pfaForm,
    accountForm,
    passwordForm,
    pfaLoading,
    accountLoading,
    passwordLoading,
    deleteConfirmText,
    deleteLoading,

    initializeForms,
    handlePFASubmit,
    handleAccountSubmit,
    handlePasswordSubmit,
    handleDeleteAccount,
  };
};
