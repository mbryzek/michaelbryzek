<script lang="ts">
  interface Props {
    items: string[];
  }

  let { items }: Props = $props();
</script>

<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
