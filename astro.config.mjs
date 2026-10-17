import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://wangxiyu0318-cyber.github.io",
  base: "/wangsculpture",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
