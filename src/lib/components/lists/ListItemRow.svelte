<script lang="ts">
	import type { ListItemWithProduct, ListType } from '$lib/types';
	import {
		GripVertical,
		Trash2,
		Plus,
		Minus,
		Package,
		CalendarDays,
		StickyNote,
		ChevronDown,
		ChevronUp,
		Wine
	} from '@lucide/svelte';
	import { dragHandle } from 'svelte-dnd-action';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import defaultLabel from '$lib/assets/default-label.png';
	import { formatISODate } from '$lib/utils/formatters';

	type Props = {
		item: ListItemWithProduct;
		listType: ListType;
		selectedStoreId?: number | null;
		index?: number;
		expandedNotes: boolean;
		editingNotes: boolean;
		notesValue?: string;
		onQuantityChange: (itemId: string, delta: number) => void;
		onYearChange: (itemId: string, year: number | null) => void;
		onCreatedAtChange: (itemId: string, date: string) => void;
		onRemove: (itemId: string, productId: string) => void;
		onToggleNotes: (itemId: string) => void;
		onStartEditNotes: (itemId: string, currentNotes: string | null) => void;
		onSaveNotes: (itemId: string, notes: string) => void;
		onCancelEditNotes: () => void;
		onNotesChange?: (value: string) => void;
	};

	let {
		item,
		listType,
		selectedStoreId = null,
		index = 0,
		expandedNotes,
		editingNotes,
		notesValue = '',
		onQuantityChange,
		onYearChange,
		onCreatedAtChange,
		onRemove,
		onToggleNotes,
		onStartEditNotes,
		onSaveNotes,
		onCancelEditNotes,
		onNotesChange
	}: Props = $props();

	const product = $derived(item.product);
	const isShopping = $derived(listType === 'shopping');
	const isCellar = $derived(listType === 'cellar');
	const isEvent = $derived(listType === 'event');
	const showQuantity = $derived(isShopping || isCellar);
	const showPrice = $derived(!isEvent && product?.price);
</script>

{#if product}
	<div class="card bg-base-200 hover:shadow-md transition-shadow relative">
		<div
			use:dragHandle
			aria-label="Dra for å endre rekkefølge"
			class="sm:hidden absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-base-300/80 text-base-content/50 cursor-grab active:cursor-grabbing"
		>
			<GripVertical size={18} />
		</div>

		<button
			class="sm:hidden absolute top-2 right-2 z-10 btn btn-ghost btn-sm btn-square bg-base-300/80 text-error"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onRemove(item.id, product.id);
			}}
			aria-label="Fjern fra liste"
		>
			<Trash2 size={16} />
		</button>

		<div class="card-body p-4 sm:p-3">
			<div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
				<div class="hidden sm:block">
					<div
						use:dragHandle
						aria-label="Dra for å endre rekkefølge"
						class="text-base-content/40 cursor-grab active:cursor-grabbing hover:text-base-content/60 transition-colors"
					>
						<GripVertical size={20} />
					</div>
				</div>

				<a href="/products/{product.id}" class="flex justify-center sm:justify-start shrink-0">
					<img
						src={product.image || defaultLabel}
						alt={product.name}
						class="w-24 h-24 sm:w-14 sm:h-14 object-contain rounded"
						loading={index < 10 ? 'eager' : 'lazy'}
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
							<div class="flex items-center gap-1">
								<Wine size={10} />
								<span>Årgang</span>
								<input
									type="text"
									inputmode="numeric"
									pattern="[0-9]*"
									class="input input-xs input-ghost px-0 w-14 text-center"
									placeholder="—"
									value={item.year ?? ''}
									onchange={(e) => {
										const val = e.currentTarget.value;
										const year = val ? parseInt(val) : null;
										if (year === null || (year >= 1900 && year <= new Date().getFullYear() + 1)) {
											onYearChange(item.id, year);
										}
									}}
								/>
							</div>
							<div class="flex items-center gap-1">
								<CalendarDays size={10} />
								<span>Lagt til</span>
								<input
									type="date"
									class="input input-xs input-ghost px-1 w-28"
									value={formatISODate(item.createdAt)}
									onchange={(e) => {
										const val = e.currentTarget.value;
										if (val) {
											onCreatedAtChange(item.id, new Date(val).toISOString());
										}
									}}
								/>
							</div>
						</div>
					{/if}
				</div>

				{#if showPrice}
					<div class="hidden sm:block text-right shrink-0 min-w-16">
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
					<div class="hidden sm:flex items-center gap-1">
						<button
							class="btn btn-xs btn-ghost btn-square"
							onclick={() => onQuantityChange(item.id, -1)}
							disabled={(item.quantity ?? 1) <= 1}
						>
							<Minus size={12} />
						</button>
						<span class="text-sm font-medium w-6 text-center">{item.quantity ?? 1}</span>
						<button
							class="btn btn-xs btn-ghost btn-square"
							onclick={() => onQuantityChange(item.id, 1)}
						>
							<Plus size={12} />
						</button>
					</div>
				{/if}

				<button
					class="hidden sm:flex btn btn-ghost btn-sm btn-square text-error opacity-50 hover:opacity-100 transition-opacity"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onRemove(item.id, product.id);
					}}
					aria-label="Fjern fra liste"
				>
					<Trash2 size={16} />
				</button>
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

					<div class="flex items-center gap-2">
						{#if showQuantity}
							<div class="flex items-center gap-1 bg-base-300 rounded-lg px-1">
								<button
									class="btn btn-xs btn-ghost btn-square"
									onclick={() => onQuantityChange(item.id, -1)}
									disabled={(item.quantity ?? 1) <= 1}
								>
									<Minus size={14} />
								</button>
								<span class="text-sm font-medium w-6 text-center">{item.quantity ?? 1}</span>
								<button
									class="btn btn-xs btn-ghost btn-square"
									onclick={() => onQuantityChange(item.id, 1)}
								>
									<Plus size={14} />
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div class="mt-2 sm:pl-9">
				<button
					class="flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content transition-colors"
					onclick={() => onToggleNotes(item.id)}
				>
					<StickyNote size={12} />
					<span>Notater</span>
					{#if item.notes}
						<span class="badge badge-xs badge-primary">1</span>
					{/if}
					{#if expandedNotes}
						<ChevronUp size={12} />
					{:else}
						<ChevronDown size={12} />
					{/if}
				</button>
				{#if expandedNotes}
					{#if editingNotes}
						<div class="flex flex-col gap-2 mt-2">
							<textarea
								class="textarea textarea-bordered textarea-sm w-full"
								rows="2"
								value={notesValue}
								oninput={(e) => onNotesChange?.(e.currentTarget.value)}
								placeholder="Legg til notater..."
							></textarea>
							<div class="flex gap-2 justify-end">
								<button class="btn btn-xs btn-ghost" onclick={onCancelEditNotes}>Avbryt</button>
								<button
									class="btn btn-xs btn-primary"
									onclick={() => onSaveNotes(item.id, notesValue)}
								>
									Lagre
								</button>
							</div>
						</div>
					{:else}
						<button
							type="button"
							class="text-xs text-base-content/70 bg-base-300 rounded p-2 w-full text-left hover:bg-base-content/10 transition-colors mt-2"
							onclick={() => onStartEditNotes(item.id, item.notes)}
						>
							{item.notes || 'Klikk for å legge til notater...'}
						</button>
					{/if}
				{/if}
			</div>
		</div>
	</div>
{/if}
