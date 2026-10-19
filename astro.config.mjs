import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://wxysculpture.com",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
