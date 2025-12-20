<script lang="ts">
	interface Props {
		href: string;
		children: any;
		class?: string;
	}

	let { href, children, class: className = '' }: Props = $props();
</script>

<a {href} class="underline hover:no-underline {className}">
	{@render children()}
</a>
