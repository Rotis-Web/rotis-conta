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

    routeRules: {
      "/**": {
        headers: {
          "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://api.anthropic.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),

          "X-Frame-Options": "DENY",

          "X-Content-Type-Options": "nosniff",

          "X-XSS-Protection": "1; mode=block",

          "Referrer-Policy": "strict-origin-when-cross-origin",

          "Permissions-Policy": [
            "camera=()",
            "microphone=()",
            "geolocation=()",
            "interest-cohort=()",
            "payment=()",
            "usb=()",
          ].join(", "),

          ...(process.env.NODE_ENV === "production" && {
            "Strict-Transport-Security":
              "max-age=31536000; includeSubDomains; preload",
          }),
        },
      },

      "/api/**": {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    },

    compressPublicAssets: true,

    minify: process.env.NODE_ENV === "production",
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

        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "referrer", content: "strict-origin-when-cross-origin" },
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
