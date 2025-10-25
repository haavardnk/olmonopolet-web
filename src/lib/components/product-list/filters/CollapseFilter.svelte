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

<div class="collapse collapse-arrow relative" class:bg-base-100={isOpen} bind:this={collapseElement}>
	<input type="checkbox" bind:checked={isOpen} />
	<div class="collapse-title text-sm font-medium py-2">
		<div class="flex items-center gap-2">
			<span>{title}</span>
			{#if computedSelectedCount > 0}
				<span class="badge badge-primary badge-sm">{computedSelectedCount}</span>
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
			class="btn btn-ghost btn-xs absolute top-1.5 right-10 z-10"
			aria-label="Tilbakestill {title}"
		>
			<X size={14} />
		</button>
	{/if}
	<div class="collapse-content">
		{#if showSearch}
			<label class="input input-sm flex items-center gap-2 mb-2">
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
					class="btn btn-ghost btn-xs w-full mb-2"
				>
					Velg alle ({items?.length})
				</button>
			{/if}
		{/if}
		{#if hasItems && items && selectedValues && onChange}
			<div class="space-y-1 max-h-64 overflow-y-auto">
				{#if isLoading}
					<p class="text-xs text-base-content/50 py-2">{loadingMessage}</p>
				{:else if items.length > 0}
					{#each items as item}
						<label class="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-1 rounded">
							<input
								type="checkbox"
								class="checkbox checkbox-xs checkbox-primary"
								checked={selectedValuesSet.has(item.value)}
								onchange={() => onChange(item.value)}
							/>
							<div class="flex-1 flex items-center justify-between">
								<span class="text-sm">{item.label}</span>
								{#if item.meta}
									<span class="text-xs text-base-content/50 ml-2">{item.meta}</span>
								{/if}
							</div>
						</label>
					{/each}
				{:else}
					<p class="text-xs text-base-content/50 py-2">{emptyMessage}</p>
				{/if}
			</div>
		{:else if children}
			{@render children()}
		{/if}
	</div>
</div>
