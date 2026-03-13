import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { webcrypto } from "node:crypto";

// Polyfill for crypto.getRandomValues during build
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = webcrypto as any;
}

const API_DOMAINS = {
  development: "https://rokka-api.codingate.asia",
  uat: "https://uat-rokka-api.codingate.asia",
  production: "https://api.rokkaresidences.com",
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const backendEnv = env.VITE_BACKEND_ENV || "development";
  const apiTarget = API_DOMAINS[backendEnv as keyof typeof API_DOMAINS];

  if (!apiTarget) {
    throw new Error(`Invalid VITE_BACKEND_ENV: ${backendEnv}`);
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    // preview: {
    //   host: "::",
    //   port: 4173,
    //   allowedHosts: [
    //     "hien-submembranous-unseclusively.ngrok-free.dev",
    //     ".ngrok-free.dev",
    //     ".ngrok.io",
    //   ],
    // },
    define: {
      __API_BASE_URL__: JSON.stringify("/api"),
      __BACKEND_ENV__: JSON.stringify(backendEnv),
    },
    plugins: [
      react(),
      componentTagger(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
