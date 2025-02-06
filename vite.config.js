import { globalConst } from "vite-plugin-global-const";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const outDir = "Y:/ekuonline";

const wrapperUrl = "https://irserver2.eku.edu/libraries/remote/wrapper.cjs";

const ekuOnline = outDir.split("/").includes("ekuonline");

const title = ekuOnline ? "EKU Online" : "Factbook";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          injectScript: `<script src="./inject.js"></script>`,
          title,
        },
      },
      template: "/index.html",
      entry: "src/main.jsx",
      minify: true,
    }),
    react(),
    globalConst({
      wrapperUrl,
      ekuOnline,
    }),
  ],
  build: { copyPublicDir: false, emptyOutDir: false, outDir },
  server: { open: true },
  base: "",
});
