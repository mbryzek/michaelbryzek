// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database } from '@cloudflare/workers-types';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}

    interface Platform {
      env: {
        TRIP_DB: D1Database;
        /** SHA-256 of the shared trip password, hex-encoded. */
        TRIP_PASSWORD_HASH: string;
        /** HMAC key for the session cookie. Unrelated to the password. */
        TRIP_COOKIE_SECRET: string;
        ANTHROPIC_API_KEY: string;
      };
    }
  }
}

export {};
