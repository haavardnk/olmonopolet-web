<script lang="ts">
	import type { Product } from '$lib/types';
	import { goto } from '$app/navigation';
	import { Funnel, Search, X, ArrowDownNarrowWide, ArrowUpWideNarrow } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import InfiniteLoading from 'svelte-infinite-loading';
	import { SORT_FIELD_LABELS, type SortField } from '$lib/constants/sorting';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import ProductFilters from '$lib/components/product-list/ProductFilters.svelte';
	import SearchAndSort from '$lib/components/product-list/controls/SearchAndSort.svelte';

	let {
		hasMore,
		loadMore,
		products,
		searchParams,
		total
	}: {
		hasMore: boolean;
		loadMore: (searchParams: URLSearchParams) => void;
		products: Product[];
		searchParams: URLSearchParams;
		total: number;
	} = $props();

	let activeFiltersCount = $state(0);
	let desktopFiltersScrollContainer: HTMLDivElement;
	let previousActiveFiltersCount = $state(0);
	let scrollContainer: HTMLDivElement;
	let searchQuery = $state(searchParams.get('search') || '');
	let showMobileFilters = $state(false);
	let hasNavigatedWithinFilters = $state(false);

	const initialSort = searchParams.get('sort') || '-rating';
	let sortBy = $state<SortField>(
		initialSort.startsWith('-') ? (initialSort.slice(1) as SortField) : (initialSort as SortField)
	);
	let sortDescending = $state(initialSort.startsWith('-'));

	let filters = $state({
		abvFrom: searchParams.get('abvFrom') || '',
		abvTo: searchParams.get('abvTo') || '',
		allergens: searchParams.get('allergens') || '',
		country: searchParams.get('country') || '',
		deliveryOptions: searchParams.get('deliveryOptions') || '',
		priceFrom: searchParams.get('priceFrom') || '',
		pricePerLiterFrom: searchParams.get('pricePerLiterFrom') || '',
		pricePerLiterTo: searchParams.get('pricePerLiterTo') || '',
		priceTo: searchParams.get('priceTo') || '',
		productSelection: searchParams.get('productSelection') || '',
		release: searchParams.get('release') || '',
		store: searchParams.get('store') || '',
		style: searchParams.get('style') || ''
	});

	const loadedCount = $derived(products.length);

	const currentSearchParams = $derived.by(() => {
		const params = new URLSearchParams();

		if (searchQuery) params.set('search', searchQuery);

		const sortValue = sortDescending ? `-${sortBy}` : sortBy;
		params.set('sort', sortValue);

		Object.entries(filters).forEach(([key, value]) => {
			if (value) params.set(key, value);
		});

		return params;
	});

	const infiniteKey = $derived(searchParams.toString());

	function compensateScrollForFilterButton(newCount: number) {
		if (previousActiveFiltersCount === 0 && newCount > 0) {
			setTimeout(() => {
				desktopFiltersScrollContainer?.scrollBy({
					top: 32,
					behavior: 'smooth'
				});
			}, 200);
		} else if (previousActiveFiltersCount > 0 && newCount === 0) {
			desktopFiltersScrollContainer?.scrollBy({ top: -32, behavior: 'smooth' });
		}
	}

	$effect(() => {
		const newCount = Object.values(filters).filter((v) => v !== '').length;
		compensateScrollForFilterButton(newCount);
		previousActiveFiltersCount = newCount;
		activeFiltersCount = newCount;
	});

	function clearFilters() {
		filters = {
			abvFrom: '',
			abvTo: '',
			allergens: '',
			country: '',
			deliveryOptions: '',
			priceFrom: '',
			pricePerLiterFrom: '',
			pricePerLiterTo: '',
			priceTo: '',
			productSelection: '',
			release: '',
			store: '',
			style: ''
		};
		updateUrl();
	}

	function clearSearch() {
		searchQuery = '';
		updateUrl();
	}

	function toggleSortDirection() {
		sortDescending = !sortDescending;
		updateUrl();
	}

	function updateUrl() {
		const params = new URLSearchParams();

		if (searchQuery) params.set('search', searchQuery);

		const sortValue = sortDescending ? `-${sortBy}` : sortBy;
		if (sortValue !== '-rating') params.set('sort', sortValue);

		Object.entries(filters).forEach(([key, value]) => {
			if (value) params.set(key, value);
		});

		const replaceState = hasNavigatedWithinFilters;
		hasNavigatedWithinFilters = true;

		goto(`/products?${params.toString()}`, { replaceState, noScroll: true });

		if (scrollContainer) {
			scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<div class="drawer lg:hidden">
	<input
		id="filter-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:checked={showMobileFilters}
	/>
	<div class="drawer-content"></div>
	<div class="drawer-side z-50">
		<label for="filter-drawer" class="drawer-overlay"></label>
		<div class="bg-base-100 w-80 min-h-full flex flex-col">
			<div
				class="sticky top-0 bg-base-100 border-b border-base-content/10 px-3 py-2 space-y-2 z-10"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-bold">Filtre</h2>
					<button
						onclick={() => (showMobileFilters = false)}
						class="btn btn-ghost btn-sm btn-circle"
						aria-label="Lukk filtre"
					>
						<X size={20} />
					</button>
				</div>
				{#if activeFiltersCount > 0}
					<div transition:slide={{ duration: 200 }}>
						<button onclick={clearFilters} class="btn btn-ghost btn-xs w-full justify-start">
							<X size={14} />
							Fjern alle filtre ({activeFiltersCount})
						</button>
					</div>
				{/if}
			</div>
			<div class="flex-1 overflow-y-auto px-3 py-2">
				<ProductFilters bind:filters onFilterChange={updateUrl} />
			</div>
		</div>
	</div>
</div>

<div class="flex h-full">
	<aside class="hidden lg:flex lg:flex-col w-80 bg-base-200 border-r border-base-content/10">
		<SearchAndSort
			bind:searchQuery
			bind:sortBy
			bind:sortDescending
			{activeFiltersCount}
			onUpdate={updateUrl}
			onClearFilters={clearFilters}
		/>
		<div class="flex-1 overflow-y-auto px-3 py-2" bind:this={desktopFiltersScrollContainer}>
			<ProductFilters bind:filters onFilterChange={updateUrl} />
		</div>
	</aside>

	<main class="flex-1 flex flex-col overflow-hidden">
		<div class="lg:hidden sticky top-0 z-40 bg-base-100 border-b border-base-content/10 shadow-sm">
			<div class="p-2">
				<div class="flex gap-2">
					<button
						onclick={() => (showMobileFilters = true)}
						class="btn btn-sm btn-square sm:btn-sm sm:w-24 relative"
						class:btn-primary={activeFiltersCount > 0}
						aria-label="Åpne filtre"
					>
						<Funnel size={18} />
						<span class="hidden sm:inline ml-1">Filtre</span>
						{#if activeFiltersCount > 0}
							<span
								class="badge badge-xs badge-accent absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
								>{activeFiltersCount}</span
							>
						{/if}
					</button>

					<label class="input input-sm flex items-center gap-2 flex-1">
						<Search size={16} class="text-base-content/50" />
						<input
							type="text"
							placeholder="Søk..."
							class="flex-1 text-sm"
							bind:value={searchQuery}
							onkeydown={(e) => e.key === 'Enter' && updateUrl()}
						/>
						{#if searchQuery}
							<button
								onclick={clearSearch}
								class="btn btn-ghost btn-xs btn-circle"
								aria-label="Tøm søk"
							>
								<X size={14} />
							</button>
						{/if}
					</label>

					<div class="flex gap-1 ml-auto">
						<select bind:value={sortBy} onchange={updateUrl} class="select select-sm w-28 md:w-48">
							{#each SORT_FIELD_LABELS as { value, label }}
								<option {value}>{label}</option>
							{/each}
						</select>
						<button
							onclick={toggleSortDirection}
							class="btn btn-sm btn-square"
							aria-label={sortDescending ? 'Synkende' : 'Stigende'}
							title={sortDescending ? 'Synkende' : 'Stigende'}
						>
							{#if sortDescending}
								<ArrowDownNarrowWide size={16} />
							{:else}
								<ArrowUpWideNarrow size={16} />
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto" data-infinite-wrapper bind:this={scrollContainer}>
			<div class="p-4 lg:p-6">
				<div class="mb-4 text-sm text-base-content/70">
					Viser {loadedCount} av {total.toLocaleString('nb-NO')} produkter
				</div>

				{#if products.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
						{#each products as product, i (product.id)}
							<ProductCard {product} index={i} noTransition={true} />
						{/each}
					</div>
				{/if}

				{#if products.length > 0 && total > products.length}
					{#key infiniteKey}
						<InfiniteLoading
							forceUseInfiniteWrapper
							distance={250}
							on:infinite={async ({ detail: { loaded, complete } }) => {
								if (!hasMore) {
									complete();
									return;
								}

								try {
									await loadMore(currentSearchParams);
									if (hasMore) {
										loaded();
									} else {
										complete();
									}
								} catch (e) {
									console.error('Infinite loading error:', e);
									complete();
								}
							}}
						>
							<div slot="spinner" class="flex justify-center py-8">
								<span class="loading loading-spinner loading-lg text-primary"></span>
							</div>
							<div slot="noMore" class="text-center py-8 text-base-content/50 text-sm">
								Ingen flere produkter
							</div>
						<div slot="noResults" class="text-center py-8 text-base-content/50 text-sm">
							Ingen produkter funnet
						</div>
					</InfiniteLoading>
				{/key}
			{/if}

			{#if products.length > 0 && products.length >= total}
				<div class="text-center py-8 text-base-content/50 text-sm">
					Ingen flere produkter
				</div>
			{/if}

			{#if products.length === 0}
					<div class="text-center py-12">
						<p class="text-lg text-base-content/70 mb-4">Ingen produkter funnet</p>
						<p class="text-sm text-base-content/50">Prøv å justere søket eller filtrene dine</p>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>
