<template>
  <div>
    <LoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const siteUrl = "https://rotis-conta.vercel.app";
const siteName = "Roti's Conta";
const defaultTitle = "Roti's Conta - Contabilitate Simplificată pentru PFA";
const defaultDescription =
  "Platformă de contabilitate pentru PFA: gestionare facturi emise și primite, registre fiscale automate, calculator CAS/CASS/Impozit, evidență completă. Simplificați contabilitatea afacerii dumneavoastră.";

useHead({
  htmlAttrs: {
    lang: "ro",
  },
  title: defaultTitle,
  titleTemplate: (titleChunk) => {
    if (!titleChunk || titleChunk === defaultTitle) {
      return defaultTitle;
    }
    return `${titleChunk} | ${siteName}`;
  },
  meta: [
    {
      name: "description",
      content: defaultDescription,
    },
    {
      name: "keywords",
      content:
        "contabilitate PFA, facturi online, registru incasari plati, calculator taxe PFA, evidenta fiscala, CAS CASS impozit, gestiune documente fiscale, contabilitate simplificata, software contabilitate Romania",
    },
    {
      name: "author",
      content: "Roti's Web",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "language",
      content: "Romanian",
    },
    {
      name: "revisit-after",
      content: "7 days",
    },
    {
      name: "theme-color",
      content: "#FFFFFF",
    },

    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: siteUrl,
    },
    {
      property: "og:title",
      content: defaultTitle,
    },
    {
      property: "og:description",
      content: defaultDescription,
    },
    {
      property: "og:image",
      content: `${siteUrl}/og-image.jpg`,
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    {
      property: "og:image:alt",
      content: "Roti's Conta - Contabilitate Simplificată pentru PFA",
    },
    {
      property: "og:site_name",
      content: siteName,
    },
    {
      property: "og:locale",
      content: "ro_RO",
    },

    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:url",
      content: siteUrl,
    },
    {
      name: "twitter:title",
      content: defaultTitle,
    },
    {
      name: "twitter:description",
      content: defaultDescription,
    },
    {
      name: "twitter:image",
      content: `${siteUrl}/og-image.jpg`,
    },
    {
      name: "twitter:image:alt",
      content: "Roti's Conta - Contabilitate Simplificată pentru PFA",
    },

    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
    },
    {
      name: "format-detection",
      content: "telephone=no",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    },
    {
      name: "apple-mobile-web-app-title",
      content: siteName,
    },

    {
      name: "msapplication-TileColor",
      content: "#4F46E5",
    },
    {
      name: "msapplication-config",
      content: "/browserconfig.xml",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/icon/favicon-96x96.png",
      sizes: "96x96",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/icon/favicon.svg",
    },
    {
      rel: "shortcut icon",
      href: "/icon/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/icon/apple-touch-icon.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      rel: "canonical",
      href: siteUrl,
    },
  ],
});

const authStore = useAuthStore();
const pageLoadingStore = usePageLoadingStore();

if (process.client) {
  pageLoadingStore.startLoading();
}

onMounted(async () => {
  try {
    if (!authStore.initialized) {
      await authStore.fetchUser();
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
  }
});
</script>
