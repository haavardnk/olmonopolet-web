<script lang="ts">
	import type { ListItemWithProduct, ListType } from '$lib/types';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import { CalendarDays, StickyNote, Package, Wine } from '@lucide/svelte';
	import defaultLabel from '$lib/assets/default-label.png';
	import { formatShortDate } from '$lib/utils/formatters';

	type Props = {
		item: ListItemWithProduct;
		listType: ListType;
		selectedStoreId?: number | null;
	};

	let { item, listType, selectedStoreId = null }: Props = $props();

	const product = $derived(item.product);
	const isShopping = $derived(listType === 'shopping');
	const isCellar = $derived(listType === 'cellar');
	const isEvent = $derived(listType === 'event');
	const showQuantity = $derived((isShopping || isCellar) && (item.quantity ?? 1) > 0);
	const showPrice = $derived(!isEvent && product?.price);
</script>

{#if product}
	<div class="card bg-base-200 shadow-sm">
		<div class="card-body p-4 sm:p-3">
			<div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
				<a href="/products/{product.id}" class="flex justify-center sm:justify-start shrink-0">
					<img
						src={product.image || defaultLabel}
						alt={product.name}
						class="w-24 h-24 sm:w-14 sm:h-14 object-contain rounded"
						onerror={(e) => {
							(e.target as HTMLImageElement).src = defaultLabel;
						}}
					/>
				</a>

				<div class="flex-1 min-w-0">
					<a href="/products/{product.id}" class="hover:underline">
						<h3 class="font-semibold text-base sm:text-sm line-clamp-2 sm:line-clamp-1">
							{product.name}
						</h3>
					</a>
					{#if product.style}
						<div class="text-sm sm:text-xs text-base-content/70 mt-0.5">
							{product.style}
						</div>
					{/if}
					<div class="flex items-center gap-3 mt-1 flex-wrap">
						<StarRating
							rating={product.rating}
							size={14}
							showValue={true}
							checkins={product.checkins}
						/>
						{#if product.strength}
							<span class="text-xs text-base-content/60">{product.strength.toFixed(1)}%</span>
						{/if}
						{#if product.volume}
							<span class="text-xs text-base-content/60">{product.volume} cl</span>
						{/if}
						{#if product.countryCode}
							<span class="fi fi-{product.countryCode.toLowerCase()}" title={product.country}
							></span>
						{/if}
						{#if isShopping && selectedStoreId && product.stock !== undefined}
							<span
								class="badge badge-sm {product.stock && product.stock > 0
									? 'badge-success'
									: 'badge-error'}"
							>
								<Package size={10} class="mr-1" />
								{product.stock && product.stock > 0 ? `${product.stock} stk` : 'Utsolgt'}
							</span>
						{/if}
						{#if isShopping && product.assortment}
							<span class="badge badge-sm badge-ghost">{product.assortment}</span>
						{/if}
					</div>
					{#if isCellar}
						<div class="flex items-center gap-3 text-xs text-base-content/50 mt-1 flex-wrap">
							{#if item.year}
								<div class="flex items-center gap-1">
									<Wine size={10} />
									<span>Årgang {item.year}</span>
								</div>
							{/if}
							{#if item.createdAt}
								<div class="flex items-center gap-1">
									<CalendarDays size={10} />
									<span>Lagt til {formatShortDate(item.createdAt)}</span>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<div class="hidden sm:flex items-center gap-3">
					{#if showPrice}
						<div class="text-right shrink-0 min-w-16">
							<div class="text-sm font-semibold">
								{(product.price! * (item.quantity ?? 1)).toFixed(0)} kr
							</div>
							{#if (item.quantity ?? 1) > 1}
								<div class="text-xs text-base-content/60">
									{product.price!.toFixed(0)} × {item.quantity}
								</div>
							{/if}
						</div>
					{/if}

					{#if showQuantity}
						<div class="text-sm font-medium text-base-content/70 bg-base-300 rounded-lg px-3 py-1">
							{item.quantity ?? 1}x
						</div>
					{/if}
				</div>
			</div>

			{#if showPrice || showQuantity}
				<div
					class="flex sm:hidden flex-row items-center justify-between gap-2 pt-3 border-t border-base-300"
				>
					{#if showPrice}
						<div class="text-left">
							<div class="text-base font-bold">
								{(product.price! * (item.quantity ?? 1)).toFixed(0)} kr
							</div>
							{#if (item.quantity ?? 1) > 1}
								<div class="text-xs text-base-content/60">
									{product.price!.toFixed(0)} × {item.quantity}
								</div>
							{/if}
						</div>
					{/if}

					{#if showQuantity}
						<div class="text-sm font-medium bg-base-300 rounded-lg px-3 py-1">
							{item.quantity ?? 1}x
						</div>
					{/if}
				</div>
			{/if}

			{#if item.notes}
				<div
					class="mt-2 pt-2 border-t border-base-300 text-sm text-base-content/70 flex items-start gap-2"
				>
					<StickyNote size={14} class="shrink-0 mt-0.5" />
					<span>{item.notes}</span>
				</div>
			{/if}
		</div>
	</div>
{/if}
