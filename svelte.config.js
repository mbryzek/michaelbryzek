import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // adapter-cloudflare rather than adapter-static: /trips/* needs a server
    // runtime for the shared-password cookie, the D1 queries, and the Anthropic
    // key, none of which can live in the browser. Every other route still
    // carries `prerender = true` from the root layout and is emitted as a plain
    // static asset — the Worker is only reached for the routes that opt out, so
    // the personal site keeps its static serving characteristics.
    //
    // This also keeps SvelteKit's "$lib/server imported into browser code"
    // build guard in play (ci/build.sh, ISS-868). Cloudflare Pages Functions —
    // the alternative that would have preserved adapter-static — run outside
    // that guard and outside SvelteKit's router entirely.
    adapter: adapter({
      routes: {
        // Everything static is served straight from the CDN; only the trip app
        // reaches the Worker.
        include: ['/trips/*'],
        exclude: ['<all>']
      }
    }),
    // Inline the app's CSS into the prerendered HTML when it is below this
    // size (bytes) instead of emitting a render-blocking <link>. The whole
    // stylesheet is critical and small, so inlining removes round trips from
    // the critical path and speeds up first paint.
    inlineStyleThreshold: 40960
  }
};

export default config;
