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
</script>

<div class="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
	<!-- Navigation -->
	<nav class="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
		<div class="mx-auto max-w-4xl px-6 py-5">
			<div class="flex items-center justify-between">
				<a
					href={urls.index}
					class="text-xl font-semibold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-200"
				>
					Michael Bryzek
				</a>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center gap-x-2">
					<div class="flex gap-x-1">
						{#each sections as section}
							<a
								href={section.href}
								class="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {isSectionActive(
									section.href
								)
									? 'text-[var(--primary)]'
									: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
							>
								{section.name}
							</a>
						{/each}
					</div>
					<ThemeToggle />
				</div>

				<!-- Mobile Menu Button -->
				<div class="flex md:hidden items-center gap-x-2">
					<ThemeToggle />
					<button
						onclick={toggleMobileMenu}
						class="mobile-menu-button p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 z-[1001] relative"
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
		</div>
	</nav>

	<!-- Mobile Menu Overlay -->
	<div
		class="mobile-menu-overlay md:hidden"
		class:open={mobileMenuOpen}
		onclick={closeMobileMenu}
	></div>

	<!-- Mobile Menu Side Panel -->
	<div class="mobile-menu md:hidden" class:open={mobileMenuOpen}>
		<div class="flex flex-col gap-y-1 p-6">
			{#each sections as section}
				<a
					href={section.href}
					onclick={closeMobileMenu}
					class="rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 border-b border-[var(--border)] {isSectionActive(
						section.href
					)
						? 'text-[var(--primary)] bg-[var(--bg-card)]'
						: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'}"
				>
					{section.name}
				</a>
			{/each}
		</div>
	</div>

	<!-- Main Content -->
	<main class="flex-1 mx-auto w-full max-w-4xl px-6 py-12">
		{#if title}
			<h1 class="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">{title}</h1>
		{/if}
		<div>
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
		<div class="mx-auto max-w-4xl px-6 py-8">
			<div class="flex items-center justify-between">
				<div class="text-sm text-[var(--text-tertiary)]">
					© {currentYear} Michael Bryzek
				</div>
				<div class="flex gap-x-4">
					<a
						href="mailto:mbryzek@gmail.com"
						class="text-[var(--text-tertiary)] transition-all duration-200 ease-out hover:text-[var(--primary)] hover:scale-110"
						aria-label="Email"
					>
						<EmailIcon />
					</a>
					<a
						href="https://twitter.com/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-[var(--text-tertiary)] transition-all duration-200 ease-out hover:text-[var(--primary)] hover:scale-110"
						aria-label="X (Twitter)"
					>
						<XIcon />
					</a>
					<a
						href="https://github.com/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-[var(--text-tertiary)] transition-all duration-200 ease-out hover:text-[var(--primary)] hover:scale-110"
						aria-label="GitHub"
					>
						<GithubIcon />
					</a>
					<a
						href="https://www.linkedin.com/in/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-[var(--text-tertiary)] transition-all duration-200 ease-out hover:text-[var(--primary)] hover:scale-110"
						aria-label="LinkedIn"
					>
						<LinkedInIcon />
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Mobile hamburger animation */
	.mobile-menu-button {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 0.5rem;
	}

	.hamburger-line {
		width: 24px;
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

	/* Mobile menu overlay */
	.mobile-menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
		z-index: 999;
	}

	.mobile-menu-overlay.open {
		opacity: 1;
		pointer-events: auto;
	}

	/* Mobile menu side panel */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: -100%;
		width: 280px;
		max-width: 85vw;
		height: 100vh;
		background: var(--bg-elevated);
		border-left: 1px solid var(--border);
		transition: right 0.3s ease;
		z-index: 1000;
		overflow-y: auto;
		padding-top: 70px; /* Account for navbar height */
	}

	.mobile-menu.open {
		right: 0;
	}

	/* Full width on smallest screens */
	@media (max-width: 640px) {
		.mobile-menu {
			width: 100%;
			max-width: 100%;
			border-left: none;
		}
	}
</style>
