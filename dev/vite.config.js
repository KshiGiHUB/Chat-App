import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // ✅ Import Node.js path module
import { fileURLToPath } from "url"; // ✅ Import fileURLToPath for ESM

// Fix __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Set alias for '@/'
    },
  },
});
