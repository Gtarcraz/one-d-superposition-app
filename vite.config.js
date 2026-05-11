import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project-site deployment:
// https://Gtarcraz.github.io/one-d-superposition-app/
// If you rename the GitHub repository, change this base to "/NEW_REPO_NAME/".
export default defineConfig({
  plugins: [react()],
  base: "/one-d-superposition-app/",
});
