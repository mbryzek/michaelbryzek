<script lang="ts">
	interface Props {
		lines: string[];
		class?: string;
	}

	let { lines, class: className = '' }: Props = $props();
</script>

<pre class="codeblock {className}">{#each lines as line}<div class="whitespace-pre-wrap">{line}</div>{/each}</pre>
