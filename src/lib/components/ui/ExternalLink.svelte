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
	class="underline hover:no-underline {className}"
>
	{@render children()}
</a>
