<script lang="ts">
  interface Props {
    lines: string[];
    class?: string;
  }

  let { lines, class: className = '' }: Props = $props();
</script>

<pre class="codeblock {className}">{lines.join('\n')}</pre>
