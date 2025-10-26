<script lang="ts" generics="T extends string | number = string">
	import { Search, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Item = {
		value: T;
		label: string;
		meta?: string;
	};

	let {
		title,
		selectedCount = 0,
		isOpen = $bindable(false),
		showSearch = false,
		searchQuery = $bindable(''),
		onReset,
		children,
		itemLabel,
		items,
		selectedValues = $bindable(),
		onChange,
		onSelectAllFiltered,
		isLoading = false,
		emptyMessage = 'Ingen resultater funnet',
		loadingMessage = 'Laster...'
	}: {
		title: string;
		selectedCount?: number;
		isOpen?: boolean;
		showSearch?: boolean;
		searchQuery?: string;
		onReset: () => void;
		children?: Snippet;
		itemLabel?: Snippet<[Item]>;
		items?: Item[];
		selectedValues?: T[];
		onChange?: (value: T) => void;
		onSelectAllFiltered?: (items: Item[]) => void;
		isLoading?: boolean;
		emptyMessage?: string;
		loadingMessage?: string;
	} = $props();

	let collapseElement: HTMLDivElement;

	const hasItems = $derived(items !== undefined);
	const computedSelectedCount = $derived(
		selectedCount > 0 ? selectedCount : selectedValues?.length || 0
	);
	const showSelectAllButton = $derived(
		onSelectAllFiltered && searchQuery && items && items.length > 0 && !isLoading
	);

	const selectedValuesArray = $derived(selectedValues ? [...selectedValues] : []);

	const selectedValuesSet = $derived(new Set(selectedValuesArray));

	function findScrollableParent(element: HTMLElement): HTMLElement | null {
		let parent = element.parentElement;
		while (parent) {
			const overflow = window.getComputedStyle(parent).overflowY;
			if (overflow === 'auto' || overflow === 'scroll') {
				return parent;
			}
			parent = parent.parentElement;
		}
		return null;
	}

	$effect(() => {
		if (isOpen && collapseElement) {
			setTimeout(() => {
				const scrollableParent = findScrollableParent(collapseElement);
				if (scrollableParent) {
					const collapseRect = collapseElement.getBoundingClientRect();
					const parentRect = scrollableParent.getBoundingClientRect();
					const collapseTop = collapseRect.top;
					const collapseBottom = collapseRect.bottom;
					const parentTop = parentRect.top;
					const parentBottom = parentRect.bottom;

					if (collapseBottom > parentBottom) {
						const scrollOffset = collapseTop - parentTop - 10;
						scrollableParent.scrollBy({ top: scrollOffset, behavior: 'smooth' });
					}
				}
			}, 300);
		}
	});
</script>

<div
	class="collapse collapse-arrow relative"
	class:bg-base-100={isOpen}
	bind:this={collapseElement}
>
	<input type="checkbox" bind:checked={isOpen} />
	<div class="collapse-title text-xs font-medium py-1.5 min-h-0">
		<div class="flex items-center gap-2">
			<span>{title}</span>
			{#if computedSelectedCount > 0}
				<span class="badge badge-primary badge-xs">{computedSelectedCount}</span>
			{/if}
		</div>
	</div>
	{#if computedSelectedCount > 0}
		<button
			type="button"
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onReset();
			}}
			class="btn btn-ghost btn-xs absolute top-0.5 right-10 z-10"
			aria-label="Tilbakestill {title}"
		>
			<X size={12} />
		</button>
	{/if}
	<div class="collapse-content pt-1 pb-2">
		{#if showSearch}
			<label class="input input-sm flex items-center gap-2 mb-1.5">
				<Search size={14} class="text-base-content/50" />
				<input type="text" placeholder="Søk..." class="flex-1" bind:value={searchQuery} />
				{#if searchQuery}
					<button
						onclick={() => (searchQuery = '')}
						class="btn btn-ghost btn-xs btn-circle"
						aria-label="Tøm søk"
					>
						<X size={12} />
					</button>
				{/if}
			</label>
			{#if showSelectAllButton}
				<button
					type="button"
					onclick={() => onSelectAllFiltered && items && onSelectAllFiltered(items)}
					class="btn btn-ghost btn-xs w-full mb-1.5"
				>
					Velg alle ({items?.length})
				</button>
			{/if}
		{/if}
		{#if hasItems && items && selectedValues && onChange}
			<div class="space-y-0.5 max-h-64 overflow-y-auto">
				{#if isLoading}
					<p class="text-xs text-base-content/50 py-1">{loadingMessage}</p>
				{:else if items.length > 0}
					{#each items as item}
						<label
							class="flex items-center gap-2 cursor-pointer hover:bg-base-200 px-1 py-0.5 rounded"
						>
							<input
								type="checkbox"
								class="checkbox checkbox-xs checkbox-primary"
								checked={selectedValuesSet.has(item.value)}
								onchange={() => onChange(item.value)}
							/>
							<div class="flex-1 flex items-center justify-between">
								{#if itemLabel}
									{@render itemLabel(item)}
								{:else}
									<span class="text-xs">{item.label}</span>
									{#if item.meta}
										<span class="text-xs text-base-content/50 ml-2">{item.meta}</span>
									{/if}
								{/if}
							</div>
						</label>
					{/each}
				{:else}
					<p class="text-xs text-base-content/50 py-1">{emptyMessage}</p>
				{/if}
			</div>
		{:else if children}
			{@render children()}
		{/if}
	</div>
</div>
