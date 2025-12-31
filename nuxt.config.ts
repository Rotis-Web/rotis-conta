import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: "2025-12-28",
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
  ],

  googleFonts: {
    families: {
      Rubik: [300, 400, 500, 600, 700],
    },
    display: "swap",
    preload: true,
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Rubik"],
          },
        },
      },
    },
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    public: {
      apiBase: "/api",
    },
  },
  rootDir: resolve(__dirname),
  nitro: {
    plugins: [resolve(__dirname, "server/plugins/mongodb")],
    logLevel: "debug",
  },
  devtools: { enabled: true },
  css: [resolve(__dirname, "assets/css/transitions.css")],
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    layoutTransition: false,
    head: {
      htmlAttrs: {
        lang: "ro",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  ssr: true,
  pinia: {
    storesDirs: [resolve(__dirname, "stores/**")],
  },
  experimental: {
    payloadExtraction: false,
  },
  build: {
    transpile: [],
  },
});
