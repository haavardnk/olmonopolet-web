<script lang="ts">
	import type { Product } from '$lib/types';
	import { SortField } from '$lib/types';
	import { goto } from '$app/navigation';
	import { X } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import InfiniteScroll from '$lib/components/common/InfiniteScroll.svelte';
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
	let previousActiveFiltersCount = $state(0);
	let showMobileFilters = $state(false);
	let hasNavigatedWithinFilters = $state(false);
	let infiniteLoading = $state(false);
	let isWideScreen = $state(false);
	let desktopFiltersScrollContainer: HTMLDivElement;
	let mainScrollContainer = $state<HTMLDivElement>();

	let searchQuery = $state(searchParams.get('search') || '');
	const initialSort = searchParams.get('sort') || `-${SortField.Rating}`;
	let sortBy = $state<SortField>(
		(initialSort.startsWith('-') ? initialSort.slice(1) : initialSort) as SortField
	);
	let sortDescending = $state(initialSort.startsWith('-'));

	let filters = $state({
		abvFrom: searchParams.get('abvFrom') || '',
		abvTo: searchParams.get('abvTo') || '',
		allergens: searchParams.get('allergens') || '',
		country: searchParams.get('country') || '',
		deliveryOptions: searchParams.get('deliveryOptions') || '',
		is_christmas_beer: searchParams.get('is_christmas_beer') || '',
		priceFrom: searchParams.get('priceFrom') || '',
		pricePerLiterFrom: searchParams.get('pricePerLiterFrom') || '',
		pricePerLiterTo: searchParams.get('pricePerLiterTo') || '',
		priceTo: searchParams.get('priceTo') || '',
		productSelection: searchParams.get('productSelection') || '',
		release: searchParams.get('release') || '',
		store: searchParams.get('store') || '',
		main_category: searchParams.get('main_category') || '',
		style: searchParams.get('style') || ''
	});

	let scrollThreshold = $derived(isWideScreen ? 600 : 1200);
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

	$effect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1280px)');
		isWideScreen = mediaQuery.matches;

		const handleChange = (e: MediaQueryListEvent) => {
			isWideScreen = e.matches;
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	});

	$effect(() => {
		const newCount = Object.values(filters).filter((v) => v !== '').length;
		compensateScrollForFilterButton(newCount);
		previousActiveFiltersCount = newCount;
		activeFiltersCount = newCount;
	});

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

	function clearFilters() {
		filters = {
			abvFrom: '',
			abvTo: '',
			allergens: '',
			country: '',
			deliveryOptions: '',
			is_christmas_beer: '',
			priceFrom: '',
			pricePerLiterFrom: '',
			pricePerLiterTo: '',
			priceTo: '',
			productSelection: '',
			release: '',
			store: '',
			main_category: '',
			style: ''
		};
		updateUrl();
	}

	function updateUrl() {
		const params = new URLSearchParams();

		if (searchQuery) params.set('search', searchQuery);

		const sortValue = sortDescending ? `-${sortBy}` : sortBy;
		if (sortValue !== `-${SortField.Rating}`) params.set('sort', sortValue);

		Object.entries(filters).forEach(([key, value]) => {
			if (value) params.set(key, value);
		});

		const replaceState = hasNavigatedWithinFilters;
		hasNavigatedWithinFilters = true;

		goto(`/products?${params.toString()}`, { replaceState, noScroll: true });

		if (isWideScreen && mainScrollContainer) {
			mainScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<div class="drawer xl:hidden">
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
	<aside class="hidden xl:flex xl:flex-col w-80 bg-base-200 border-r border-base-content/10">
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

	<main class="flex-1 flex flex-col xl:overflow-hidden bg-base-100">
		<div
			class="xl:hidden sticky top-[var(--header-offset,0px)] z-40 bg-base-100 border-b border-base-content/10 shadow-sm"
		>
			<SearchAndSort
				bind:searchQuery
				bind:sortBy
				bind:sortDescending
				{activeFiltersCount}
				onUpdate={updateUrl}
				onClearFilters={clearFilters}
				mobile={true}
				onOpenFilters={() => (showMobileFilters = true)}
			/>
		</div>

		<div
			class="flex-1 xl:overflow-y-auto bg-base-100"
			bind:this={mainScrollContainer}
			data-scroll-container
		>
			<div class="p-4 lg:p-6">
				<div class="mb-4 text-sm text-base-content/70">
					Viser {loadedCount} av {total.toLocaleString('nb-NO')} produkter
				</div>

				{#if products.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
						{#each products as product, i (product.id)}
							<ProductCard {product} index={i} noTransition={true} />
						{/each}
					</div>
				{/if}

				{#if products.length === 0}
					<div class="text-center py-12">
						<p class="text-lg text-base-content/70 mb-4">Ingen produkter funnet</p>
						<p class="text-sm text-base-content/50">Prøv å justere søket eller filtrene dine</p>
					</div>
				{:else}
					<InfiniteScroll
						{hasMore}
						bind:loading={infiniteLoading}
						onLoadMore={() => loadMore(currentSearchParams)}
						threshold={scrollThreshold}
						scrollRoot={isWideScreen ? mainScrollContainer : null}
					>
						{#snippet spinner()}
							<div class="flex justify-center py-8">
								<span class="loading loading-spinner loading-lg text-primary"></span>
							</div>
						{/snippet}
						{#snippet complete()}
							<div class="text-center py-8 text-base-content/50 text-sm">Ingen flere produkter</div>
						{/snippet}
					</InfiniteScroll>
				{/if}
			</div>
		</div>
	</main>
</div>
