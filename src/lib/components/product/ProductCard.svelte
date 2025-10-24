<script lang="ts">
	import { fly } from 'svelte/transition';
	import { DollarSign, Droplets, Percent, MapPin, Tag } from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import defaultLabel from '$lib/assets/default-label.png';
	import type { Product } from '$lib/types';

	let { product, index }: { product: Product; index: number } = $props();
</script>

<a
	href="/beers/{product.id}"
	in:fly={{ y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] block"
>
	<div class="card-body p-4 sm:p-6">
		<div class="flex flex-row gap-4 items-stretch">
			<div class="flex items-start sm:items-center flex-shrink-0">
				<img
					src={product.image || defaultLabel}
					alt={product.name + ' etikett'}
					class="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-lg shadow"
				/>
			</div>
			<div class="flex flex-col gap-2 justify-between h-full flex-1 min-w-0">
				<h3 class="font-bold text-base sm:text-lg mb-1 line-clamp-2">
					{product.name}
				</h3>
				<div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
					<span
						class="badge badge-outline badge-sm sm:badge-md overflow-hidden whitespace-nowrap text-ellipsis"
						>{product.style || 'Ukjent stil'}</span
					>
				</div>
				<div class="flex flex-col gap-2">
					<div class="flex flex-wrap gap-3">
						{#if product.price}
							<span class="flex items-center gap-1 text-sm"
								><DollarSign size={14} class="text-primary" />
								{product.price.toFixed(2)} kr</span
							>
						{/if}
						{#if product.volume}
							<span class="flex items-center gap-1 text-sm"
								><Droplets size={14} class="text-primary" />
								{(product.volume * 1000).toFixed(0)} ml</span
							>
						{/if}
						{#if product.strength}
							<span class="flex items-center gap-1 text-sm"
								><Percent size={14} class="text-primary" /> {product.strength.toFixed(1)}%</span
							>
						{/if}
						{#if product.country}
							<span class="flex items-center gap-1 text-sm"
								><MapPin size={14} class="text-primary" />
								{product.country}</span
							>
						{/if}
						{#if product.assortment}
							<span class="flex items-center gap-1 text-sm"
								><Tag size={14} class="text-primary" />
								{product.assortment}
							</span>
						{/if}
					</div>
					<StarRating
						rating={product.rating}
						size={14}
						showValue={true}
						checkins={product.checkins}
					/>
				</div>
			</div>
		</div>
	</div>
</a>
