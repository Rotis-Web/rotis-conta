import type { PFAData } from "../../types";

interface Message {
  type: "success" | "error";
  text: string;
}

export const useSettings = () => {
  const authStore = useAuthStore();

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
  const pfaMessage = ref<Message | null>(null);

  const accountLoading = ref(false);
  const accountMessage = ref<Message | null>(null);

  const passwordLoading = ref(false);
  const passwordMessage = ref<Message | null>(null);

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
    pfaMessage.value = null;

    try {
      await authStore.updatePFAData(pfaForm.value);
      pfaMessage.value = {
        type: "success",
        text: "Datele PFA au fost actualizate cu succes!",
      };
    } catch (error: any) {
      pfaMessage.value = {
        type: "error",
        text: error.message || "A apărut o eroare la salvarea datelor PFA",
      };
    } finally {
      pfaLoading.value = false;
    }
  };

  const handleAccountSubmit = async () => {
    accountLoading.value = true;
    accountMessage.value = null;

    try {
      await authStore.updateProfile({
        nume: accountForm.value.nume,
        email: accountForm.value.email,
      });
      accountMessage.value = {
        type: "success",
        text: "Datele contului au fost actualizate cu succes!",
      };
    } catch (error: any) {
      accountMessage.value = {
        type: "error",
        text: error.message || "A apărut o eroare la salvarea datelor",
      };
    } finally {
      accountLoading.value = false;
    }
  };

  const handlePasswordSubmit = async () => {
    passwordMessage.value = null;

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordMessage.value = {
        type: "error",
        text: "Parolele nu coincid!",
      };
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      passwordMessage.value = {
        type: "error",
        text: "Parola trebuie să aibă cel puțin 6 caractere!",
      };
      return;
    }

    passwordLoading.value = true;

    try {
      await authStore.updatePassword({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      });

      passwordMessage.value = {
        type: "success",
        text: "Parola a fost schimbată cu succes!",
      };

      passwordForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    } catch (error: any) {
      passwordMessage.value = {
        type: "error",
        text: error.message || "A apărut o eroare la schimbarea parolei",
      };
    } finally {
      passwordLoading.value = false;
    }
  };

  return {
    activeTab,
    pfaForm,
    accountForm,
    passwordForm,
    pfaLoading,
    pfaMessage,
    accountLoading,
    accountMessage,
    passwordLoading,
    passwordMessage,

    initializeForms,
    handlePFASubmit,
    handleAccountSubmit,
    handlePasswordSubmit,
  };
};
