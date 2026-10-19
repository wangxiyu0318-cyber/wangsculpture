import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://wangsculpture.com",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
