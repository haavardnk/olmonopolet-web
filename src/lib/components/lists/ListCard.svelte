<script lang="ts">
	import type { UserList } from '$lib/types';
	import { GripVertical, Pencil, Trash2, Share2, Beer } from '@lucide/svelte';
	import { dragHandle } from 'svelte-dnd-action';

	type Props = {
		list: UserList;
		isDragging?: boolean;
		onEdit?: (list: UserList) => void;
		onDelete?: (list: UserList) => void;
		onShare?: (list: UserList) => void;
	};

	let { list, isDragging = false, onEdit, onDelete, onShare }: Props = $props();

	const productCount = $derived(list.productIds.length);
</script>

<div
	class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow relative"
	class:opacity-50={isDragging}
	class:ring-2={isDragging}
	class:ring-primary={isDragging}
>
	<a href="/lists/{list.id}" class="absolute inset-0" aria-label="Åpne {list.name}"></a>
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
				<h3 class="card-title text-base truncate">{list.name}</h3>
				{#if list.description}
					<p class="text-sm text-base-content/70 line-clamp-2 mt-1">{list.description}</p>
				{/if}
				<div class="flex items-center gap-1 mt-2 text-sm text-base-content/60">
					<Beer size={14} />
					<span>{productCount} {productCount === 1 ? 'produkt' : 'produkter'}</span>
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
