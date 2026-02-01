<script lang="ts">
	import type { Product } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { DollarSign, Droplets, Percent, Tag } from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import ProductActions from '$lib/components/product/ProductActions.svelte';
	import defaultLabel from '$lib/assets/default-label.png';
	import { authStore } from '$lib/stores/auth.svelte';

	let {
		product,
		index,
		noTransition = false,
		onTastedToggle,
		isTogglingTasted = false,
		variant = 'products'
	}: {
		product: Product;
		index: number;
		noTransition?: boolean;
		onTastedToggle?: (productId: string, currentState: boolean) => void;
		isTogglingTasted?: boolean;
		variant?: 'products' | 'release';
	} = $props();
</script>

<div
	in:fly={noTransition ? { y: 0, duration: 0 } : { y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
>
	<a href="/products/{product.id}" class="absolute inset-0 z-0">
		<span class="sr-only">Se detaljer for {product.name}</span>
	</a>

	{#if authStore.isAuthenticated}
		<div
			class="absolute top-2 right-2 z-10 pointer-events-auto {variant === 'products'
				? 'sm:hidden'
				: ''}"
		>
			<ProductActions
				productId={product.id}
				userTasted={product.userTasted}
				{isTogglingTasted}
				{onTastedToggle}
				variant="compact"
			/>
		</div>
	{/if}

	<div class="card-body p-4 sm:p-6 relative z-1 pointer-events-none">
		<div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
			<div class="flex flex-col gap-2 items-center sm:items-start shrink-0 sm:w-32">
				<img
					src={product.image || defaultLabel}
					alt={product.name + ' etikett'}
					class="w-24 h-24 sm:w-full sm:h-32 object-contain rounded-lg"
					loading={index < 6 ? 'eager' : 'lazy'}
					decoding="async"
				/>

				{#if authStore.isAuthenticated && variant === 'products'}
					<div class="hidden sm:block pointer-events-auto w-full">
						<ProductActions
							productId={product.id}
							userTasted={product.userTasted}
							{isTogglingTasted}
							{onTastedToggle}
							variant="full"
						/>
					</div>
				{/if}
			</div>

			<div class="flex flex-col gap-3 flex-1 min-w-0">
				<div class="flex flex-col gap-2">
					<h3 class="font-bold text-lg sm:text-xl line-clamp-2">
						{product.name}
					</h3>
					<div class="flex items-center gap-2 flex-wrap">
						{#if product.isChristmasBeer}
							<div class="badge badge-error gap-1 shadow-sm">
								<span>🎄</span>
								<span class="font-semibold">Juleøl</span>
							</div>
						{/if}
						{#if product.style}
							<p class="text-sm opacity-70">{product.style}</p>
						{/if}
					</div>
				</div>

				<div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
					{#if product.price}
						<span class="flex items-center gap-1.5">
							<DollarSign size={16} class="text-primary shrink-0" />
							<span class="font-semibold">{product.price.toFixed(2)} kr</span>
						</span>
					{/if}
					{#if product.volume}
						<span class="flex items-center gap-1.5">
							<Droplets size={16} class="text-primary shrink-0" />
							<span>{(product.volume * 1000).toFixed(0)} ml</span>
						</span>
					{/if}
					{#if product.strength}
						<span class="flex items-center gap-1.5">
							<Percent size={16} class="text-primary shrink-0" />
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
							<Tag size={16} class="text-primary shrink-0" />
							<span>{product.assortment}</span>
						</span>
					{/if}
				</div>

				<div class="mt-auto">
					<StarRating rating={product.rating} size={20} showValue={true} />
				</div>
			</div>
		</div>
	</div>
</div>
