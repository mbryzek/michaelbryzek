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

	function isSectionActive(sectionHref: string): boolean {
		return currentPath === sectionHref;
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
				<div class="flex items-center gap-x-2">
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
			</div>
		</div>
	</nav>

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
