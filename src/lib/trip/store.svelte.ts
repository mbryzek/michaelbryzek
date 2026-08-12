import { browser } from '$app/environment';
import type { Idea, Item, ItemKind, Note, Question, Trip } from './types';

/**
 * Client state for the trip app.
 *
 * The whole trip is fetched in one request and mirrored to localStorage. That
 * mirror is the reason the app opens instantly with no signal — which it needs
 * to do in Varenna, in Praiano, and on the Athens–Paros ferry. The network
 * result replaces the mirror when it arrives; until then the cached trip is
 * rendered with a staleness marker rather than a spinner.
 */

const BASE = '/trips/europe-26/api';
const MIRROR_KEY = 'trip:europe-26:mirror';
const NAME_KEY = 'trip:europe-26:name';

const EMPTY: Trip = { days: [], items: [], ideas: [], notes: [], questions: [] };

/** Derived from `fetch` itself rather than the `RequestInit` DOM global, which
 * this lint config does not expose to .svelte.ts files. */
type FetchInit = Parameters<typeof fetch>[1];

async function call<T>(path: string, init?: FetchInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) }
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

class TripStore {
  trip = $state<Trip>(EMPTY);
  signedIn = $state<boolean | null>(null);
  name = $state<string | null>(null);
  loading = $state(false);
  /** Set when the render came from the local mirror rather than the network. */
  stale = $state(false);
  errorMessage = $state<string | null>(null);

  /* ---------------- derived views ---------------- */

  itemsOn(date: string): Item[] {
    return this.trip.items.filter((i) => i.date === date);
  }

  ideasOn(date: string): Idea[] {
    return this.trip.ideas.filter((i) => i.date === date && !i.promotedAt);
  }

  notesOn(date: string): Note[] {
    return this.trip.notes.filter((n) => n.date === date);
  }

  openQuestions(): Question[] {
    return this.trip.questions.filter((q) => !q.resolvedAt);
  }

  /** The anticipation count: everything saved or planned but not yet booked. */
  lookingForwardCount(): number {
    const ideas = this.trip.ideas.filter((i) => !i.promotedAt).length;
    const planned = this.trip.items.filter((i) => !i.confirmed).length;
    return ideas + planned;
  }

  /* ---------------- local mirror ---------------- */

  private readMirror(): Trip | null {
    if (!browser) return null;
    try {
      const raw = localStorage.getItem(MIRROR_KEY);
      return raw ? (JSON.parse(raw) as Trip) : null;
    } catch {
      // Storage blocked (Lockdown Mode, private browsing). Not fatal — the app
      // just loses its offline copy.
      return null;
    }
  }

  private writeMirror(trip: Trip): void {
    if (!browser) return;
    try {
      localStorage.setItem(MIRROR_KEY, JSON.stringify(trip));
    } catch {
      /* quota or blocked storage — the app still works online */
    }
  }

  /** Display name only. The session itself stays in the signed HttpOnly cookie. */
  private readName(): string | null {
    if (!browser) return null;
    try {
      return localStorage.getItem(NAME_KEY);
    } catch {
      return null;
    }
  }

  private writeName(name: string): void {
    if (!browser) return;
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {
      /* blocked storage */
    }
  }

  /* ---------------- session ---------------- */

  async checkSession(): Promise<void> {
    try {
      const result = await call<{ signedIn: boolean; name: string | null }>('/auth');
      this.signedIn = result.signedIn;
      this.name = result.name;
      if (result.name) this.writeName(result.name);
    } catch {
      // Offline: trust the mirror. If there is cached trip data this browser
      // was signed in at some point, and locking someone out of a cached
      // itinerary because a plane has no wifi would be the wrong call.
      const mirror = this.readMirror();
      this.signedIn = mirror !== null;
      if (mirror) {
        this.trip = mirror;
        this.stale = true;
        // Restore the name too. Without it, "is this my note" is false for
        // everything offline, so the delete control silently disappears —
        // which happens to look right (deleting needs the network anyway) but
        // is right by accident, and would read as a bug the first time anyone
        // noticed it.
        this.name = this.readName();
      }
    }
  }

  async signIn(name: string, password: string): Promise<void> {
    const result = await call<{ name: string }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ name, password })
    });
    this.signedIn = true;
    this.name = result.name;
    this.writeName(result.name);
    await this.load();
  }

  async signOut(): Promise<void> {
    await call('/auth', { method: 'DELETE' });
    this.signedIn = false;
    this.name = null;
    this.trip = EMPTY;
    if (browser) {
      localStorage.removeItem(MIRROR_KEY);
      localStorage.removeItem(NAME_KEY);
    }
  }

  /* ---------------- loading ---------------- */

  async load(): Promise<void> {
    // Paint from the mirror first so the app is never blank while the network
    // decides whether it is going to answer.
    const mirror = this.readMirror();
    if (mirror && this.trip.days.length === 0) {
      this.trip = mirror;
      this.stale = true;
    }

    this.loading = true;
    this.errorMessage = null;
    try {
      const trip = await call<Trip>('/trip');
      this.trip = trip;
      this.stale = false;
      this.writeMirror(trip);
    } catch (err) {
      if (this.trip.days.length === 0) {
        this.errorMessage = err instanceof Error ? err.message : 'Could not load the trip';
      } else {
        // We have something to show; say it may be out of date rather than
        // replacing a usable itinerary with an error.
        this.stale = true;
      }
    } finally {
      this.loading = false;
    }
  }

  /**
   * Applies a local change and persists the mirror. Callers hand back the new
   * trip so mutations stay in one place rather than each one remembering to
   * re-mirror.
   */
  private apply(next: Trip): void {
    this.trip = next;
    this.writeMirror(next);
  }

  /* ---------------- notes ---------------- */

  async addNote(date: string, body: string): Promise<void> {
    const note = await call<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify({ date, body })
    });
    this.apply({ ...this.trip, notes: [...this.trip.notes, note] });
  }

  async deleteNote(id: number): Promise<void> {
    await call(`/notes?id=${id}`, { method: 'DELETE' });
    this.apply({ ...this.trip, notes: this.trip.notes.filter((n) => n.id !== id) });
  }

  /* ---------------- ideas ---------------- */

  async saveIdea(input: { date: string; title: string; detail: string; sourceQ: string }): Promise<void> {
    const idea = await call<Idea>('/ideas', { method: 'POST', body: JSON.stringify(input) });
    this.apply({ ...this.trip, ideas: [...this.trip.ideas, idea] });
  }

  async promoteIdea(id: number): Promise<void> {
    const item = await call<Item>('/ideas', {
      method: 'PATCH',
      body: JSON.stringify({ id })
    });
    this.apply({
      ...this.trip,
      items: [...this.trip.items, item],
      ideas: this.trip.ideas.map((i) => (i.id === id ? { ...i, promotedAt: new Date().toISOString() } : i))
    });
  }

  async deleteIdea(id: number): Promise<void> {
    await call(`/ideas?id=${id}`, { method: 'DELETE' });
    this.apply({ ...this.trip, ideas: this.trip.ideas.filter((i) => i.id !== id) });
  }

  /* ---------------- items ---------------- */

  async addItem(input: { date: string; kind: ItemKind; title: string; detail?: string; startTime?: string }): Promise<void> {
    const item = await call<Item>('/trip', {
      method: 'POST',
      body: JSON.stringify({ ...input, confirmed: false })
    });
    this.apply({ ...this.trip, items: [...this.trip.items, item] });
  }

  async updateItem(id: number, patch: Record<string, unknown>): Promise<void> {
    const item = await call<Item>('/trip', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...patch })
    });
    this.apply({
      ...this.trip,
      items: this.trip.items.map((i) => (i.id === id ? item : i))
    });
  }

  async deleteItem(id: number): Promise<void> {
    await call(`/trip?id=${id}`, { method: 'DELETE' });
    this.apply({ ...this.trip, items: this.trip.items.filter((i) => i.id !== id) });
  }

  /* ---------------- open questions ---------------- */

  async resolveQuestion(id: number, resolved: boolean): Promise<void> {
    await call('/trip', {
      method: 'PATCH',
      body: JSON.stringify({ what: 'question', id, resolved })
    });
    this.apply({
      ...this.trip,
      questions: this.trip.questions.map((q) => (q.id === id ? { ...q, resolvedAt: resolved ? new Date().toISOString() : null } : q))
    });
  }

  async addQuestion(question: string, date: string | null): Promise<void> {
    const created = await call<Question>('/trip', {
      method: 'POST',
      body: JSON.stringify({ what: 'question', question, date })
    });
    this.apply({ ...this.trip, questions: [...this.trip.questions, created] });
  }
}

export const trip = new TripStore();
