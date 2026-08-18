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
   * `Link.pins.test.ts` fails the suite if one reappears.
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
</script>

<a
  {href}
  class={className}
  aria-label={ariaLabel}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}>{@render children()}</a
>
