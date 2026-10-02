import adapter from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  // SvelteKit 3 takes its configuration here, through the plugin; a
  // `svelte.config.js` beside this file is refused outright.
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      // Kit 3 replaces `$lib` with the `#lib` subpath import; this keeps `$lib`.
      // svelte-vitals (ci/build.sh) follows component imports through Kit
      // aliases but not through package.json `imports`, so under `#lib` it
      // cannot see the <Seo> head tags every page renders.
      alias: { $lib: 'src/lib' },
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
    })
  ],

  // Svelte ships a server build and a client build behind export conditions, and
  // the server one has no `mount()` — so a component test resolves the wrong
  // half and fails with `lifecycle_function_unavailable` unless the browser
  // condition is picked explicitly. Scoped to VITEST so the real `vite build`
  // still resolves normally and keeps prerendering on the server build.
  //
  // Only component tests need this; the data tests run in the default node
  // environment and opt out by simply not asking for a DOM. A test that wants
  // one declares `@vitest-environment happy-dom` in its own docblock, which
  // keeps the fast pure-data suites out of a DOM they have no use for.
  //
  // Spread rather than `resolve: ... : undefined`, because under
  // `exactOptionalPropertyTypes` an explicit `undefined` is not the same as an
  // absent key and vite's `UserConfig` does not accept one.
  ...(process.env['VITEST'] ? { resolve: { conditions: ['browser'] } } : {})
});
