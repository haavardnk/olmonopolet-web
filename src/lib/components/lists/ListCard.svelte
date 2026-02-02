<script lang="ts">
	import type { UserList } from '$lib/types';
	import { GripVertical, Pencil, Trash2, Share2, Beer, Calendar, Wine } from '@lucide/svelte';
	import { dragHandle } from 'svelte-dnd-action';
	import ListTypeBadge from './ListTypeBadge.svelte';
	import { formatShortDate, formatCurrency, getBottleCountLabel } from '$lib/utils/formatters';

	type Props = {
		list: UserList;
		isDragging?: boolean;
		onEdit?: (list: UserList) => void;
		onDelete?: (list: UserList) => void;
		onShare?: (list: UserList) => void;
	};

	let { list, isDragging = false, onEdit, onDelete, onShare }: Props = $props();

	const productCount = $derived(list.itemCount ?? list.productIds.length);
</script>

<div
	class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow relative"
	class:opacity-50={isDragging}
	class:ring-2={isDragging}
	class:ring-primary={isDragging}
	class:opacity-60={list.isPast}
>
	<a href="/lists/{list.id}" class="absolute inset-0 z-0" aria-label="Åpne {list.name}"></a>

	<div class="card-body p-4 relative pointer-events-none">
		<div class="flex items-start gap-3">
			<div
				use:dragHandle
				aria-label="Dra for å endre rekkefølge"
				class="flex items-center text-base-content/50 pt-1 cursor-grab active:cursor-grabbing pointer-events-auto"
			>
				<GripVertical size={20} />
			</div>

			<div class="flex-1 min-w-0">
				<div class="flex items-center gap-2 flex-wrap">
					<h3 class="font-bold text-base line-clamp-1">{list.name}</h3>
					<ListTypeBadge listType={list.listType} />
					{#if list.isPast}
						<span class="badge badge-sm badge-ghost">Passert</span>
					{/if}
				</div>

				{#if list.description}
					<p class="text-sm text-base-content/70 line-clamp-2 mt-1">{list.description}</p>
				{/if}

				<div class="flex items-center gap-3 text-sm text-base-content/60 flex-wrap mt-2">
					<div class="flex items-center gap-1">
						<Beer size={14} />
						<span>{productCount} {productCount === 1 ? 'produkt' : 'produkter'}</span>
					</div>
					{#if list.listType === 'event' && list.eventDate}
						<div class="flex items-center gap-1">
							<Calendar size={14} />
							<span>{formatShortDate(list.eventDate)}</span>
						</div>
					{/if}
					{#if list.listType === 'cellar' && list.stats}
						<div class="flex items-center gap-1">
							<Wine size={14} />
							<span>{getBottleCountLabel(list.stats.totalBottles)}</span>
							{#if list.stats.oldestYear && list.stats.newestYear}
								<span>({list.stats.oldestYear}-{list.stats.newestYear})</span>
							{/if}
						</div>
					{/if}
					{#if list.listType === 'shopping' && list.totalPrice}
						<div class="flex items-center gap-1">
							<span>{formatCurrency(list.totalPrice)}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex items-center gap-1 pointer-events-auto">
				{#if onShare}
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onShare(list);
						}}
						aria-label="Del liste"
					>
						<Share2 size={16} />
					</button>
				{/if}
				{#if onEdit}
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onEdit(list);
						}}
						aria-label="Rediger liste"
					>
						<Pencil size={16} />
					</button>
				{/if}
				{#if onDelete}
					<button
						class="btn btn-ghost btn-sm btn-square text-error"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onDelete(list);
						}}
						aria-label="Slett liste"
					>
						<Trash2 size={16} />
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
