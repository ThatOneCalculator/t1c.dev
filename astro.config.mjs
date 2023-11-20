import { defineConfig } from "astro/config";

import icon from "astro-icon";
// https://astro.build/config
export default defineConfig({
  experimental: {
    optimizeHoistedScript: true,
  },

  integrations: [
    icon({
      include: {
        ph: [
          "hand-pointing-bold",
          "link-bold",
          "confetti-bold",
          "hand-fist-bold",
          "cursor-text-bold",
          "arrow-left-bold",
          "envelope-open-bold",
          "github-logo-bold",
          "gitlab-logo-simple-bold",
          "discord-logo-bold",
        ],
      },
    }),
  ],
});
