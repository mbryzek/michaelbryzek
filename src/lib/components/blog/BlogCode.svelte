<script lang="ts">
  interface Props {
    lines: string[];
  }

  let { lines }: Props = $props();
</script>

<pre class="codeblock">{lines.join('\n')}</pre>
