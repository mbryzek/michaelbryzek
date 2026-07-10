import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    // Inline the app's CSS into the prerendered HTML when it is below this
    // size (bytes) instead of emitting a render-blocking <link>. The whole
    // stylesheet is critical and small, so inlining removes round trips from
    // the critical path and speeds up first paint.
    inlineStyleThreshold: 40960
  }
};

export default config;
