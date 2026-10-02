import { defineEnvVars } from '@sveltejs/kit/env';

// The version stamp the /_internal_/version endpoint reports. release-sveltekit
// exports the real values into the build environment (process env beats .env
// files); `.env` holds empty defaults so non-release builds compile. Static, so
// the build-time value is inlined into the prerendered payload.
export const variables = defineEnvVars({
  PUBLIC_VERSION: {
    public: true,
    static: true,
    description: 'Release version, stamped by release-sveltekit; empty outside a release build.'
  },
  PUBLIC_RELEASED_AT: {
    public: true,
    static: true,
    description: 'Release timestamp, stamped by release-sveltekit; empty outside a release build.'
  }
});
