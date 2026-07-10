<script lang="ts">
  interface Props {
    items: string[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();
</script>

<ul class={className}>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
