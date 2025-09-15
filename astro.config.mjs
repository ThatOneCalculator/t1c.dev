import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
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
          "book-open-text-bold",
          "envelope-open-fill",
          "telegram-logo-fill",
        ],
        "simple-icons": ["signal", "musicbrainz"],
      },
    }),
  ],
});
