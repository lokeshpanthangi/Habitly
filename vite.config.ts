import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Use 0.0.0.0 for better compatibility with Render
    port: parseInt(process.env.PORT) || 8080, // Automatically uses Render's PORT
    strictPort: true, // Prevents port conflicts
  },
  preview: {
    port: parseInt(process.env.PORT) || 8080, // Ensure preview also uses the correct port
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500, // Avoids chunk size warning during build
  },
}));
