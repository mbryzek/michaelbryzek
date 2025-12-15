<script lang="ts">
	interface Props {
		children: any;
		class?: string;
	}

	let { children, class: className = '' }: Props = $props();
</script>

<h2 class="mt-8 text-xl font-semibold text-gray-100 {className}">
	{@render children()}
</h2>
