<script lang="ts">
	interface Props {
		children: any;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<h2 class="mt-8 mb-4 text-xl font-semibold text-[var(--text-primary)] {className}">
	{@render children()}
</h2>
