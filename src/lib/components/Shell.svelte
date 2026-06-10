<script lang="ts">
	import { page } from '$app/stores';
	import { urls } from '$lib/urls';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import LinkedInIcon from '$lib/components/icons/LinkedInIcon.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	interface Props {
		title?: string;
		children: any;
	}

	let { title, children }: Props = $props();

	const sections = [
		{ href: urls.index, name: 'About' },
		{ href: urls.blog, name: 'Blog' },
		{ href: urls.projects, name: 'Projects' },
		{ href: urls.talks, name: 'Talks' },
		{ href: urls.links, name: 'Links' }
	];

	const currentPath = $derived($page.url.pathname);
	const currentYear = new Date().getFullYear();

	let mobileMenuOpen = $state(false);

	function isSectionActive(sectionHref: string): boolean {
		return currentPath === sectionHref;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleMobileMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeMobileMenu();
			return;
		}
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

<div class="min-h-screen flex flex-col">
	<!-- Top bar -->
	<header class="topbar">
		<div
			class="mx-auto w-full max-w-[1080px] px-6 py-4 flex items-center justify-between gap-6"
		>
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
					onclick={toggleMobileMenu}
					class="mobile-menu-button"
					class:active={mobileMenuOpen}
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen}
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
	></button>

	<!-- Mobile menu side panel -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="mobile-menu md:hidden" class:open={mobileMenuOpen} onkeydown={handleMobileMenuKeydown}>
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
	<main class="flex-1 mx-auto w-full max-w-[1080px] px-6 py-10 md:py-14">
		{#if title}
			<h1 class="page-title">{title}</h1>
		{/if}
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="foot mt-auto">
		<div
			class="mx-auto w-full max-w-[1080px] px-6 py-7 flex items-center justify-between gap-4"
		>
			<span>© {currentYear} Michael Bryzek</span>
			<div class="socials">
				<a href="mailto:mbryzek@gmail.com" aria-label="Email"><EmailIcon /></a>
				<a
					href="https://twitter.com/mbryzek"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="X (Twitter)"><XIcon /></a
				>
				<a
					href="https://github.com/mbryzek"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="GitHub"><GithubIcon /></a
				>
				<a
					href="https://www.linkedin.com/in/mbryzek"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LinkedIn"><LinkedInIcon /></a
				>
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
		position: relative;
		z-index: 1001;
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
		height: 100vh;
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
		height: 100vh;
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
		transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
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
