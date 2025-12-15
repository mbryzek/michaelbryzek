<script lang="ts">
	import type { PageData } from './$types';
	import Shell from '$lib/components/Shell.svelte';
	import ManagingStateInElmSinglePageApps from '$lib/posts/ManagingStateInElmSinglePageApps.svelte';
	import MotivationBehindTrueAcumen from '$lib/posts/MotivationBehindTrueAcumen.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<Shell>
	{#if data.post.slug === 'managing-state-in-elm-single-page-applications'}
		<ManagingStateInElmSinglePageApps title={data.post.title} date={data.post.date} />
	{:else if data.post.slug === 'motivation-behind-true-acumen'}
		<MotivationBehindTrueAcumen title={data.post.title} date={data.post.date} />
	{/if}
</Shell>
