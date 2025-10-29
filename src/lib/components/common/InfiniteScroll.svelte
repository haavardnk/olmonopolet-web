<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		hasMore = true,
		loading = $bindable(false),
		onLoadMore,
		threshold = 800,
		scrollRoot = null,
		spinner,
		complete
	}: {
		hasMore: boolean;
		loading?: boolean;
		onLoadMore: () => Promise<void> | void;
		threshold?: number;
		scrollRoot?: HTMLElement | null;
		spinner?: Snippet;
		complete?: Snippet;
	} = $props();

	let sentinel = $state<HTMLDivElement>();
	let observer: IntersectionObserver;

	$effect(() => {
		if (!sentinel) return;

		if (observer) observer.disconnect();

		observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting && hasMore && !loading) {
					loading = true;
					try {
						await onLoadMore();
					} catch (error) {
						console.error('InfiniteScroll: Error loading more:', error);
					} finally {
						loading = false;
					}
				}
			},
			{
				root: scrollRoot,
				rootMargin: `0px 0px ${threshold}px 0px`,
				threshold: 0
			}
		);

		observer.observe(sentinel);

		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

{#if hasMore}
	{#if loading}
		{#if spinner}
			{@render spinner()}
		{:else}
			<div class="flex justify-center py-8">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{/if}
	{/if}
	<div bind:this={sentinel} class="h-px w-full" aria-hidden="true"></div>
{:else if complete}
	{@render complete()}
{/if}
