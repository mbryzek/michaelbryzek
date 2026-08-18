import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],

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
