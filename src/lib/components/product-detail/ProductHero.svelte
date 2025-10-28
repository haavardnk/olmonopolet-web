<script lang="ts">
	import type { Product } from '$lib/types';
	import { ExternalLink } from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';

	let { product }: { product: Product } = $props();

	const hasExternalLinks = $derived(product.vmpUrl || product.untappdUrl);
</script>

<div>
	<h1 class="text-2xl sm:text-3xl font-bold text-base-content mb-1">{product.name}</h1>
	<p class="text-sm sm:text-lg text-base-content/70">{product.style || 'Øl'}</p>

	<div class="mt-2">
		<div class="flex items-center gap-1">
			<div class="flex items-center gap-1 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:sm:w-6 [&_svg]:sm:h-6">
				<StarRating rating={product.rating} size={16} showValue={false} />
			</div>
			<span class="text-xs sm:text-lg ml-1 opacity-80">
				{product.rating?.toFixed(1) || 'N/A'}
				{#if product.checkins}
					<span class="opacity-60">({product.checkins})</span>
				{/if}
			</span>
		</div>
	</div>

	{#if hasExternalLinks}
		<div class="flex gap-2 mt-2 text-xs sm:text-sm">
			{#if product.vmpUrl}
				<a
					href={product.vmpUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
				>
					<ExternalLink size={14} />
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
					<ExternalLink size={14} />
					Untappd
				</a>
			{/if}
		</div>
	{/if}
</div>
