<script lang="ts">
  export interface ItemWithTitle {
    title: string;
    content: string;
  }

  interface Props {
    items: ItemWithTitle[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();
</script>

<ul class={className}>
  {#each items as item}
    <li>
      <span class="title">{item.title}</span>
      <span>{item.content}</span>
    </li>
  {/each}
</ul>

<style>
  li {
    margin-bottom: var(--space-3);
  }
  .title {
    display: block;
    font-weight: var(--fw-semibold);
    color: var(--text);
    margin-bottom: 2px;
  }
</style>
