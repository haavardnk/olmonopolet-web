<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Star, DollarSign, Droplets, Percent, MapPin, Tag } from '@lucide/svelte';
	import defaultLabel from '$lib/assets/default-label.png';

	let { product, index } = $props();
</script>

<div
	in:fly={{ y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
>
	<div class="card-body p-4 sm:p-6">
		<div class="flex flex-row gap-4 items-stretch">
			<!-- First column: Image -->
			<div class="flex items-start sm:items-center flex-shrink-0">
				<img
					src={product.label_sm_url || defaultLabel}
					alt={product.vmp_name + ' etikett'}
					class="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded shadow"
				/>
			</div>
			<!-- Second column: Info rows -->
			<div class="flex flex-col gap-2 justify-between h-full flex-1 min-w-0">
				<!-- Row 1: Name -->
				<h3 class="font-bold text-base sm:text-lg mb-1 line-clamp-2">
					{product.vmp_name}
				</h3>
				<!-- Row 2: Badges -->
				<div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
					{#if product.style}
						<span
							class="badge badge-outline badge-sm sm:badge-md overflow-hidden whitespace-nowrap text-ellipsis"
							>{product.style}</span
						>
					{/if}
				</div>
				<!-- Row 3: Product info and rating -->
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
								{product.volume} ml</span
							>
						{/if}
						{#if product.abv}
							<span class="flex items-center gap-1 text-sm"
								><Percent size={14} class="text-primary" /> {product.abv}%</span
							>
						{/if}
						{#if product.country}
							<span class="flex items-center gap-1 text-sm"
								><MapPin size={14} class="text-primary" />
								{product.country}</span
							>
						{/if}
						{#if product.product_selection}
							<span class="flex items-center gap-1 text-sm"
								><Tag size={14} class="text-primary" />
								{product.product_selection}
							</span>
						{/if}
					</div>
					{#if product.rating}
						<div class="flex items-center gap-1 mt-1">
							{#each [1, 2, 3, 4, 5] as star}
								<Star
									size={14}
									class={star <= product.rating
										? 'text-yellow-400 fill-yellow-400'
										: 'text-gray-300'}
								/>
							{/each}
							<span class="text-xs sm:text-sm ml-1 opacity-80"
								>{product.rating.toFixed(1)} ({product.checkins})</span
							>
						</div>
					{/if}
				</div>
				<!-- Add actions or dropdown here if needed -->
			</div>
		</div>
	</div>
</div>
