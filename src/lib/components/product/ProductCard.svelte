<script lang="ts">
	import type { Product } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { DollarSign, Droplets, Percent, Tag } from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import defaultLabel from '$lib/assets/default-label.png';

	let {
		product,
		index,
		noTransition = false
	}: { product: Product; index: number; noTransition?: boolean } = $props();
</script>

<a
	href="/products/{product.id}"
	in:fly={noTransition ? undefined : { y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] block"
>
	<div class="card-body p-4 sm:p-6">
		<div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
			<div class="flex justify-center sm:justify-start flex-shrink-0">
				<img
					src={product.image || defaultLabel}
					alt={product.name + ' etikett'}
					class="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg"
				/>
			</div>

			<div class="flex flex-col gap-3 flex-1 min-w-0">
				<div class="flex flex-col gap-1">
					<h3 class="font-bold text-lg sm:text-xl line-clamp-2">
						{product.name}
					</h3>
					{#if product.style}
						<p class="text-sm opacity-70">{product.style}</p>
					{/if}
				</div>

				<div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
					{#if product.price}
						<span class="flex items-center gap-1.5">
							<DollarSign size={16} class="text-primary flex-shrink-0" />
							<span class="font-semibold">{product.price.toFixed(2)} kr</span>
						</span>
					{/if}
					{#if product.volume}
						<span class="flex items-center gap-1.5">
							<Droplets size={16} class="text-primary flex-shrink-0" />
							<span>{(product.volume * 1000).toFixed(0)} ml</span>
						</span>
					{/if}
					{#if product.strength}
						<span class="flex items-center gap-1.5">
							<Percent size={16} class="text-primary flex-shrink-0" />
							<span>{product.strength.toFixed(1)}%</span>
						</span>
					{/if}
					{#if product.country}
						<span class="flex items-center gap-1.5">
							{#if product.countryCode}
								<span class="fi fi-{product.countryCode.toLowerCase()}"></span>
							{/if}
							<span>{product.country}</span>
						</span>
					{/if}
					{#if product.assortment}
						<span class="flex items-center gap-1.5">
							<Tag size={16} class="text-primary flex-shrink-0" />
							<span>{product.assortment}</span>
						</span>
					{/if}
				</div>

				<div class="mt-auto">
					<StarRating rating={product.rating} size={16} showValue={true} />
				</div>
			</div>
		</div>
	</div>
</a>
