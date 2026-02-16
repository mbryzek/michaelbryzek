<script lang="ts">
	interface Props {
		href: string;
		children: any;
		class?: string;
	}

	let { href, children, class: className = '' }: Props = $props();
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200 {className}"
>
	{@render children()}
</a>
