export default defineNuxtConfig({
  compatibilityDate: "2024-12-28",

  modules: ["@nuxtjs/tailwindcss", "@nuxt/image"],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,

    public: {
      apiBase: process.env.API_BASE_URL || "/api",
    },
  },

  nitro: {
    plugins: ["~/server/plugins/mongodb.ts"],
  },

  app: {
    head: {
      title: "Roti's Conta",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },

  devtools: { enabled: true },
});
