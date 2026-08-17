<script lang="ts">
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import { urls } from '$lib/urls';
  import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
  import XIcon from '$lib/components/icons/XIcon.svelte';
  import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
  import LinkedInIcon from '$lib/components/icons/LinkedInIcon.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Link from '$lib/components/ui/Link.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();

  const sections = [
    { href: urls.index, name: 'About' },
    { href: urls.blog, name: 'Blog' },
    { href: urls.projects, name: 'Projects' },
    { href: urls.talks, name: 'Talks' },
    { href: urls.links, name: 'Links' }
  ];

  const currentYear = new Date().getFullYear();

  let mobileMenuOpen = $state(false);
  let mobileMenuEl: HTMLElement | undefined = $state();
  let mobileMenuButtonEl: HTMLButtonElement | undefined = $state();

  function isSectionActive(sectionHref: string): boolean {
    return page.url.pathname === sectionHref;
  }

  // Lock the ROOT element, not <body>. app.css sets `html { overflow-y: scroll }`
  // to reserve the scrollbar gutter, and the body's overflow only propagates to
  // the viewport while the root's own overflow is `visible` — so the usual
  // `document.body.style.overflow = 'hidden'` was silently doing nothing and the
  // page scrolled behind the open panel. `scrollbar-gutter: stable` is already on
  // the same element, so locking it shifts no layout.
  //
  // Driven by an effect rather than set imperatively from open/close, because
  // <html> outlives this component and every route mounts its own <Shell>: a
  // history navigation with the panel open — the back gesture, which is how a
  // phone user dismisses an overlay — destroys the instance holding the lock
  // without running either handler. The effect's teardown releases it on the way
  // out, and re-running it on mount clears whatever a previous instance left.
  // Nothing else could: the remounted Shell has `mobileMenuOpen === false`, so
  // Escape and the resize handler both no-op and only a reload frees the page.
  $effect(() => {
    document.documentElement.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  });

  // The panel is `inert` while closed, so focus can only be moved into it after
  // the DOM has been updated — hence the `tick()`. Without moving focus in, the
  // Tab trap and Escape handling below would never fire: focus would stay on the
  // hamburger, which sits outside the panel.
  async function openMobileMenu() {
    mobileMenuOpen = true;
    await tick();
    mobileMenuEl?.querySelector<HTMLElement>('a')?.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenuOpen) return;
    mobileMenuOpen = false;
    mobileMenuButtonEl?.focus();
  }

  function toggleMobileMenu() {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      void openMobileMenu();
    }
  }

  // Escape is handled on the window rather than the panel so it works no matter
  // where focus happens to be while the menu is open.
  function handleWindowKeydown(e: KeyboardEvent) {
    if (mobileMenuOpen && e.key === 'Escape') {
      closeMobileMenu();
    }
  }

  // The panel, its overlay and the hamburger are all `md:hidden`. Crossing to
  // the desktop breakpoint with the menu open therefore hides every control that
  // could close it while the scroll lock above stays on — a page nothing but
  // Escape can unstick. Close on the way past instead. 768px is Tailwind's `md`.
  const DESKTOP_BREAKPOINT = 768;

  function handleWindowResize() {
    if (mobileMenuOpen && window.innerWidth >= DESKTOP_BREAKPOINT) {
      closeMobileMenu();
    }
  }

  function handleMobileMenuKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const menu = e.currentTarget as HTMLElement;
    const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} onresize={handleWindowResize} />

<div class="min-h-screen flex flex-col">
  <!-- Top bar -->
  <header class="topbar">
    <div class="page-shell py-4 flex items-center justify-between gap-6">
      <a href={urls.index} class="brand">
        <span class="mark">M</span>
        <span>Michael Bryzek</span>
      </a>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-4">
        <nav class="topnav">
          {#each sections as section}
            <a href={section.href} aria-current={isSectionActive(section.href) ? 'page' : undefined}>
              {section.name}
            </a>
          {/each}
        </nav>
        <ThemeToggle />
      </div>

      <!-- Mobile controls -->
      <div class="flex md:hidden items-center gap-3">
        <ThemeToggle />
        <button
          bind:this={mobileMenuButtonEl}
          onclick={toggleMobileMenu}
          class="mobile-menu-button"
          class:active={mobileMenuOpen}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile menu overlay -->
  <button
    class="mobile-menu-overlay md:hidden"
    class:open={mobileMenuOpen}
    onclick={closeMobileMenu}
    aria-label="Close menu"
    tabindex="-1"
    inert={!mobileMenuOpen}
  ></button>

  <!-- Mobile menu side panel. `inert` while closed keeps its links out of the tab
       order and out of the accessibility tree — the panel is only translated
       off-screen, never hidden, so without it a phone user tabbing from the
       hamburger lands on invisible links. -->
  <div
    bind:this={mobileMenuEl}
    id="mobile-menu"
    class="mobile-menu md:hidden"
    class:open={mobileMenuOpen}
    onkeydown={handleMobileMenuKeydown}
    inert={!mobileMenuOpen}
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
    tabindex="-1"
  >
    <div class="flex flex-col p-4">
      {#each sections as section}
        <a
          href={section.href}
          onclick={closeMobileMenu}
          aria-current={isSectionActive(section.href) ? 'page' : undefined}
          class="mobile-link"
        >
          {section.name}
        </a>
      {/each}
    </div>
  </div>

  <!-- Main content -->
  <main class="page-shell flex-1 py-10 md:py-14">
    {#if title}
      <h1 class="page-title">{title}</h1>
    {/if}
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="foot mt-auto">
    <div class="page-shell py-7 flex items-center justify-between gap-4">
      <span>© {currentYear} Michael Bryzek</span>
      <div class="socials">
        <a href="mailto:mbryzek@gmail.com" aria-label="Email"><EmailIcon /></a>
        <Link href="https://twitter.com/mbryzek" ariaLabel="X (Twitter)"><XIcon /></Link>
        <Link href="https://github.com/mbryzek" ariaLabel="GitHub"><GithubIcon /></Link>
        <Link href="https://www.linkedin.com/in/mbryzek" ariaLabel="LinkedIn"><LinkedInIcon /></Link>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Mobile hamburger */
  .mobile-menu-button {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    background: transparent;
    border: 0;
    cursor: pointer;
  }
  .mobile-menu-button:hover {
    color: var(--text);
    background: var(--surface-2);
  }
  .mobile-menu-button:focus-visible {
    outline: none;
    box-shadow: var(--ring);
  }

  .hamburger-line {
    width: 22px;
    height: 2px;
    background: currentColor;
    transition: all 0.3s ease;
    display: block;
  }
  .mobile-menu-button.active .hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .mobile-menu-button.active .hamburger-line:nth-child(2) {
    opacity: 0;
  }
  .mobile-menu-button.active .hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* Overlay */
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 999;
    border: 0;
  }
  .mobile-menu-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  /* Side panel */
  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    max-width: 85vw;
    height: 100dvh;
    background: var(--surface);
    border-left: 1px solid var(--hairline);
    transition: right 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
    padding-top: 72px;
  }
  .mobile-menu.open {
    right: 0;
  }

  .mobile-link {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    font-size: var(--text-base);
    font-weight: var(--fw-medium);
    color: var(--text-muted);
    text-decoration: none;
    border-bottom: 1px solid var(--hairline);
    transition:
      color var(--dur) var(--ease),
      background var(--dur) var(--ease);
  }
  .mobile-link:hover {
    color: var(--text);
    background: var(--surface-2);
  }
  .mobile-link[aria-current='page'] {
    color: var(--accent-text);
    background: var(--surface-2);
  }

  @media (max-width: 640px) {
    .mobile-menu {
      width: 100%;
      max-width: 100%;
      border-left: none;
    }
  }
</style>
