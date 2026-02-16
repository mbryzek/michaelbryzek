<script lang="ts">
	interface Props {
		children: any;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<p class="text-[var(--text-secondary)] leading-relaxed text-[15px] {className}">
	{@render children()}
</p>
