<script lang="ts">
	import type { Product } from '$lib/types';
	import { ExternalLink } from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';

	let { product }: { product: Product } = $props();

	const hasExternalLinks = $derived(product.vmpUrl || product.untappdUrl);
</script>

<div>
	<h1 class="text-2xl sm:text-4xl font-bold text-base-content mb-2">{product.name}</h1>
	<p class="text-base sm:text-xl text-base-content/70">{product.style || 'Øl'}</p>

	<div class="mt-3">
		<StarRating rating={product.rating} size={20} showValue={true} checkins={product.checkins} />
	</div>

	{#if hasExternalLinks}
		<div class="flex gap-2 mt-4 text-sm">
			{#if product.vmpUrl}
				<a
					href={product.vmpUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
				>
					<ExternalLink size={16} />
					Vinmonopolet
				</a>
			{/if}
			{#if product.untappdUrl}
				<span class="opacity-50">•</span>
				<a
					href={product.untappdUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
				>
					<ExternalLink size={16} />
					Untappd
				</a>
			{/if}
		</div>
	{/if}
</div>
