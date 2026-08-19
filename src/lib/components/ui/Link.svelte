<script lang="ts">
  import type { Snippet } from 'svelte';
  import { isExternal } from '$lib/site';

  /**
   * Every anchor in the app goes through here so that "off this origin" is
   * decided in one place. An off-origin link opens in a new tab and must carry
   * `rel="noopener"`, or the new document gets a live `window.opener` handle on
   * this one; a link to a path on this site must NOT open in a new tab, which
   * would bypass client-side routing and strand the visitor in a second tab of
   * the same site (#32). Nothing in the build, svelte-check, eslint or the test
   * suite notices a hand-written anchor that gets one half of that wrong, so
   * `Link.test.ts` fails the suite if one reappears.
   *
   * The site's keyboard focus ring is decided here for the same reason. Every
   * interactive element on the site shows it, so whether a given anchor rings is
   * not a per-call-site choice — it follows from being an anchor, and saying so
   * once is what keeps the next one from being written without it. A call site
   * that passes `class` still gets it; the two are concatenated rather than
   * chosen between, with `focus-ring` last so the call site's own class is what
   * a reader sees first.
   */
  interface Props {
    href: string;
    /** Pass-through, so call sites keep the class the CSS keys on. */
    class?: string;
    ariaLabel?: string;
    children: Snippet;
  }

  let { href, class: className, ariaLabel, children }: Props = $props();

  let external = $derived(isExternal(href));
  let classes = $derived(className === undefined ? 'focus-ring' : `${className} focus-ring`);
</script>

<a {href} class={classes} aria-label={ariaLabel} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
  >{@render children()}</a
>
