<script lang="ts">
	import { page } from '$app/stores';
	import { urls } from '$lib/urls';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import XIcon from '$lib/components/icons/XIcon.svelte';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import LinkedInIcon from '$lib/components/icons/LinkedInIcon.svelte';

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

<div class="min-h-screen bg-gray-800 text-gray-200">
	<!-- Navigation -->
	<nav class="border-b border-gray-700">
		<div class="mx-auto max-w-3xl px-4 py-6">
			<div class="flex items-center justify-between">
				<a href={urls.index} class="text-xl font-bold text-gray-100 hover:text-white">
					Michael Bryzek
				</a>
				<div class="flex ml-2 mr-2">
					{#each sections as section}
						<a
							href={section.href}
							class="rounded-md px-2 py-2 text-sm font-medium {isSectionActive(section.href)
								? 'bg-gray-900 text-white'
								: 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
						>
							{section.name}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-3xl px-4 py-6">
		{#if title}
			<h1 class="text-2xl font-bold text-gray-100">{title}</h1>
		{/if}
		<div class="mt-6">
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<div class="mt-4 bg-gray-800 border-t border-gray-700">
		<div class="mx-auto max-w-3xl px-4 py-4">
			<div class="flex items-center justify-between gap-x-4 px-2">
				<div class="text-sm text-gray-500">
					© {currentYear} Michael Bryzek
				</div>
				<div class="flex space-x-2">
					<a
						href="mailto:mbryzek@gmail.com"
						class="text-sm text-gray-500 transition hover:text-gray-600"
					>
						<span class="sr-only">Email</span>
						<EmailIcon />
					</a>
					<a
						href="https://twitter.com/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-gray-500 transition hover:text-gray-600"
					>
						<span class="sr-only">X</span>
						<XIcon />
					</a>
					<a
						href="https://github.com/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-gray-500 transition hover:text-gray-600"
					>
						<span class="sr-only">GitHub</span>
						<GithubIcon />
					</a>
					<a
						href="https://www.linkedin.com/in/mbryzek"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-gray-500 transition hover:text-gray-600"
					>
						<span class="sr-only">LinkedIn</span>
						<LinkedInIcon />
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
