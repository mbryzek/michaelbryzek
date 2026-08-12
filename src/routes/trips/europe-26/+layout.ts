/**
 * The trip pages are a client-rendered app behind a prerendered shell.
 *
 * `prerender` keeps the HTML a plain static asset — instant to load, trivial to
 * cache in a service worker for the days with no signal. `ssr = false` is what
 * makes that safe: the shell is built at deploy time and contains no trip data
 * at all, so the password gates the data rather than the URL. Everything is
 * fetched from /api/* once the browser has a valid session cookie.
 */
export const prerender = true;
export const ssr = false;
