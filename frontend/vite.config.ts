/**
 * Vite configuration for the AI Leftover Chef frontend.
 *
 * This configuration enables React and Tailwind CSS while providing
 * the development environment used during local development.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});