import type { $Fetch } from "ofetch";

declare global {
  const $fetch: $Fetch;
  const navigateTo: (
    to: string | { name?: string; path?: string }
  ) => Promise<void>;

  // Store composables
  const useAuthStore: () => import("./stores/auth").ReturnType<
    typeof import("./stores/auth").useAuthStore
  >;
  const useFacturiStore: () => import("./stores/facturi").ReturnType<
    typeof import("./stores/facturi").useFacturiStore
  >;
  const useRegistreStore: () => import("./stores/registre").ReturnType<
    typeof import("./stores/registre").useRegistreStore
  >;
  const useDocumentsStore: () => import("./stores/documents").ReturnType<
    typeof import("./stores/documents").useDocumentsStore
  >;
}

export {};
