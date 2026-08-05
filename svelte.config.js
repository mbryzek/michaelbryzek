import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      // Emit build/404.html so a direct hit on an unknown path renders the
      // site's own +error.svelte instead of the host's generic 404 page.
      fallback: '404.html',
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
