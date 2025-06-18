import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    paths: {
      base:
        process.env.NODE_ENV === "production" ? "/beermonopoly-releases" : "",
    },
  },
};

export default config;
