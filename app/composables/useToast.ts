import { toast } from "vue3-toastify";

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      autoClose: 3000,
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      autoClose: 4000,
    });
  };

  const info = (message: string) => {
    toast.info(message, {
      autoClose: 3000,
    });
  };

  const warning = (message: string) => {
    toast.warning(message, {
      autoClose: 3500,
    });
  };

  const loading = (message: string) => {
    return toast.loading(message);
  };

  const update = (toastId: any, options: any) => {
    toast.update(toastId, options);
  };

  const dismiss = (toastId?: any) => {
    if (toastId) {
      toast.remove(toastId);
    } else {
      toast.clearAll();
    }
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
  };
};
