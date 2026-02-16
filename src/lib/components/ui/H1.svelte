<script lang="ts">
	interface Props {
		children: any;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<h1 class="text-3xl font-bold text-[var(--text-primary)] {className}">
	{@render children()}
</h1>
