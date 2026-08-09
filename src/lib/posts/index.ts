import type { Component } from 'svelte';
import type { BlogSlug } from '$lib/data/blog';
import ManagingStateInElmSinglePageApps from './ManagingStateInElmSinglePageApps.svelte';
import MotivationBehindTrueAcumen from './MotivationBehindTrueAcumen.svelte';

/** Every post component takes exactly this — the heading it renders. */
export interface PostProps {
  title: string;
  date: string;
}

/**
 * The component that renders each post. `Record<BlogSlug, ...>` is what makes
 * this exhaustive: adding an entry to `blogPosts` without writing its component
 * is a compile error here, rather than a `/blog/<slug>` that prerenders to an
 * empty page — which is what the `{#if slug === '...'}` chain this replaces did,
 * with nothing in the build or the tests to notice.
 */
export const postComponents: Record<BlogSlug, Component<PostProps>> = {
  'managing-state-in-elm-single-page-applications': ManagingStateInElmSinglePageApps,
  'motivation-behind-true-acumen': MotivationBehindTrueAcumen
};
