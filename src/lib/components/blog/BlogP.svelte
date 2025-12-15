<script lang="ts">
	interface Props {
		children: any;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<p class="mt-4 leading-relaxed text-gray-100 {className}">
	{@render children()}
</p>
