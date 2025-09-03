<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import {
		Star,
		StarHalf,
		DollarSign,
		Droplets,
		Percent,
		MapPin,
		Tag,
		ExternalLink
	} from '@lucide/svelte';
	import defaultLabel from '$lib/assets/default-label.png';

	let { product, index } = $props();
	let isHovered = $state(false);
</script>

<div
	in:fly={{ y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] relative group"
	role="button"
	tabindex="0"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<div
		class="card-body p-4 sm:p-6 transition-opacity duration-200 ease-out"
		class:opacity-50={isHovered}
	>
		<div class="flex flex-row gap-4 items-stretch">
			<div class="flex items-start sm:items-center flex-shrink-0">
				<img
					src={product.label_sm_url || defaultLabel}
					alt={product.vmp_name + ' etikett'}
					class="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-lg shadow"
				/>
			</div>
			<div class="flex flex-col gap-2 justify-between h-full flex-1 min-w-0">
				<h3 class="font-bold text-base sm:text-lg mb-1 line-clamp-2">
					{product.vmp_name}
				</h3>
				<div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
					<span
						class="badge badge-outline badge-sm sm:badge-md overflow-hidden whitespace-nowrap text-ellipsis"
						>{product.style || product.sub_category || product.main_category}</span
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
								{product.volume * 1000} ml</span
							>
						{/if}
						{#if product.abv}
							<span class="flex items-center gap-1 text-sm"
								><Percent size={14} class="text-primary" /> {product.abv}</span
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
								{#if product.rating >= star}
									<Star size={14} class="text-yellow-400 fill-yellow-400" />
								{:else if product.rating >= star - 0.5}
									<StarHalf size={14} class="text-yellow-400 fill-yellow-400" />
								{:else}
									<Star size={14} class="text-gray-300" />
								{/if}
							{/each}
							<span class="text-xs sm:text-sm ml-1 opacity-80">
								{product.rating.toFixed(1)} ({product.checkins})
							</span>
						</div>
					{:else}
						<div class="flex items-center gap-1 mt-1">
							{#each [1, 2, 3, 4, 5] as star}
								<Star size={14} class="text-gray-300" />
							{/each}
							<span class="text-xs sm:text-sm ml-1 opacity-60">Ingen vurderinger</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	{#if isHovered && (product.vmp_url || product.untpd_url)}
		<div
			class="absolute inset-0 flex items-center justify-center gap-3"
			in:fade={{ duration: 150 }}
			out:fade={{ duration: 100 }}
		>
			{#if product.vmp_url}
				<a
					href={product.vmp_url}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-primary btn-md flex items-center gap-2 shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl"
				>
					<ExternalLink size={16} />
					Vinmonopolet
				</a>
			{/if}
			{#if product.untpd_url}
				<a
					href={product.untpd_url}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-secondary btn-md flex items-center gap-2 shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl"
				>
					<ExternalLink size={16} />
					Untappd
				</a>
			{/if}
		</div>
	{/if}
</div>
