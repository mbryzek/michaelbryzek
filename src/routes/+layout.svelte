<script lang="ts">
	import '../app.css';

	interface Props {
		children: any;
	}

	let { children }: Props = $props();
</script>

<!-- Prevent flash by setting dark mode before hydration -->
<svelte:head>
	<script>
		// Set dark mode immediately
		(function () {
			const stored = localStorage.getItem('theme');
			const isDark = stored ? stored === 'dark' : true; // Default to dark
			if (isDark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		})();
	</script>
</svelte:head>

{@render children()}
