# Europe 2026 — trip companion

A private, shared itinerary for Mike and Lisa's 9 September – 3 October 2026
trip, at `bryzek.com/trips/europe-26`. Day-by-day plan, a per-day notes thread
between the two of us, and a day-scoped assistant that already knows the trip
and can search the web.

Design doc: `~/code/claude/plans/2026-08-11-trip-europe26-design.md`.

## One-time setup

Everything below runs once, against the `personal` Cloudflare account. Nothing
here is automated because each step either mints a secret or costs money.

### 1. Create the database

```sh
wrangler d1 create bryzek-trips
```

Paste the printed `database_id` into `wrangler.toml`, replacing the
`REPLACE_ME_...` placeholder. Then load the schema and the itinerary:

```sh
wrangler d1 migrations apply bryzek-trips --remote
```

### 2. Set the three secrets

```sh
# The shared password, hashed. Pick the password first, then hash it:
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR PASSWORD')).then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))"

wrangler pages secret put TRIP_PASSWORD_HASH --project-name michaelbryzek   # paste the hash
wrangler pages secret put TRIP_COOKIE_SECRET --project-name michaelbryzek   # any long random string
wrangler pages secret put ANTHROPIC_API_KEY  --project-name michaelbryzek   # console.anthropic.com
```

`TRIP_COOKIE_SECRET` signs the session cookie and is unrelated to the password —
rotating it signs everyone out, which is the intended way to revoke access.

### 3. Deploy

```sh
dev release michaelbryzek
```

Then send Lisa the URL and the password. On her phone: open in Safari, Share →
**Add to Home Screen**. It installs as an icon and launches full-screen.

## Running it locally

```sh
cp /dev/null .dev.vars     # then fill in the three keys below (git-ignored)
wrangler d1 migrations apply bryzek-trips --local
npm run build
wrangler pages dev
```

`.dev.vars` wants `TRIP_PASSWORD_HASH`, `TRIP_COOKIE_SECRET` and
`ANTHROPIC_API_KEY`. Local D1 keys its storage by binding name, so the
placeholder `database_id` in `wrangler.toml` is fine for local work.

Note `wrangler pages dev` serves the **built** output — rerun `npm run build`
after changing anything, and restart it (a rebuild replaces the directory out
from under the running server).

## How it fits together

| Piece                                     | Where                                     |
| ----------------------------------------- | ----------------------------------------- |
| Prerendered shells, no trip data in them  | `+layout.ts` (`prerender`, `ssr = false`) |
| Shared-password auth, signed cookie       | `$lib/server/trip/auth.ts`                |
| Every D1 query                            | `$lib/server/trip/db.ts`                  |
| Claude call: model, tools, prompt caching | `$lib/server/trip/claude.ts`              |
| Client state and the offline mirror       | `$lib/trip/store.svelte.ts`               |
| Schema and the seeded itinerary           | `migrations/`                             |

The page HTML is a static shell containing no trip content — the password gates
the **data**, not the URL. Only `/trips/europe-26/api/*` reaches the Worker;
everything else is served from the CDN (see the generated `_routes.json`).

## Cost

Roughly **$10–15 of Anthropic usage for the whole trip**, planning month
included: about 300 messages with the itinerary behind a prompt-cache
breakpoint, plus ~150 web searches at $10 per 1,000. Cloudflare D1 and Pages
are inside the free tier at this size.

## Changing the itinerary

Edit it in the app — it is the source of truth once seeded. `migrations/` is
only the starting state; do not re-run the seed against a live database, it
would insert a second copy of every row.
