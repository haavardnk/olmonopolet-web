<script lang="ts">
	import { untrack } from 'svelte';
	import RangeFilter from '$lib/components/product-list/controls/RangeFilter.svelte';
	import StoreFilter from '$lib/components/product-list/filters/StoreFilter.svelte';
	import StyleFilter from '$lib/components/product-list/filters/StyleFilter.svelte';
	import CountryFilter from '$lib/components/product-list/filters/CountryFilter.svelte';
	import ProductSelectionFilter from '$lib/components/product-list/filters/ProductSelectionFilter.svelte';
	import AllergenFilter from '$lib/components/product-list/filters/AllergenFilter.svelte';
	import DeliveryFilter from '$lib/components/product-list/filters/DeliveryFilter.svelte';
	import ReleaseFilter from '$lib/components/product-list/filters/ReleaseFilter.svelte';
	import { isChristmasSeason } from '$lib/utils/helpers';

	let {
		filters = $bindable(),
		onFilterChange
	}: {
		filters: {
			abvFrom: string;
			abvTo: string;
			allergens: string;
			country: string;
			deliveryOptions: string;
			is_christmas_beer: string;
			priceFrom: string;
			pricePerLiterFrom: string;
			pricePerLiterTo: string;
			priceTo: string;
			productSelection: string;
			release: string;
			store: string;
			style: string;
		};
		onFilterChange: () => void;
	} = $props();

	let selectedCountries = $state<string[]>([]);
	let selectedDeliveryOptions = $state<string[]>([]);
	let selectedProductSelections = $state<string[]>([]);
	let selectedReleases = $state<string[]>([]);
	let selectedStores = $state<number[]>([]);
	let selectedStyles = $state<string[]>([]);

	let openSections = $state({
		allergens: false,
		country: false,
		delivery: false,
		productSelection: false,
		release: false,
		store: false,
		style: false
	});

	$effect(() => {
		selectedCountries = filters.country ? filters.country.split(',') : [];
		selectedDeliveryOptions = filters.deliveryOptions ? filters.deliveryOptions.split(',') : [];
		selectedProductSelections = filters.productSelection ? filters.productSelection.split(',') : [];
		selectedReleases = filters.release ? filters.release.split(',') : [];
		selectedStores = filters.store
			? filters.store
					.split(',')
					.map(Number)
					.filter((n) => !isNaN(n))
			: [];
		selectedStyles = filters.style ? filters.style.split(',') : [];
	});

	function syncArrayToFilter(
		array: string[] | number[],
		filterKey: keyof typeof filters,
		triggerUpdate = true
	) {
		const joined = array.join(',');
		if (filters[filterKey] !== joined) {
			filters[filterKey] = joined;
			if (triggerUpdate) {
				untrack(() => queueMicrotask(() => onFilterChange()));
			}
		}
	}

	$effect(() => syncArrayToFilter(selectedCountries, 'country'));
	$effect(() => syncArrayToFilter(selectedDeliveryOptions, 'deliveryOptions'));
	$effect(() => syncArrayToFilter(selectedProductSelections, 'productSelection'));
	$effect(() => syncArrayToFilter(selectedReleases, 'release'));
	$effect(() => syncArrayToFilter(selectedStores, 'store'));
	$effect(() => syncArrayToFilter(selectedStyles, 'style'));

	function resetRangeFilter(fromKey: keyof typeof filters, toKey: keyof typeof filters) {
		filters[fromKey] = '';
		filters[toKey] = '';
		onFilterChange();
	}

	function toggleChristmasBeer() {
		filters.is_christmas_beer = filters.is_christmas_beer === 'True' ? '' : 'True';
		onFilterChange();
	}
</script>

<div class="space-y-1">
	{#if isChristmasSeason()}
		<div class="p-2">
			<button
				onclick={toggleChristmasBeer}
				class="btn btn-sm w-full {filters.is_christmas_beer === 'True'
					? 'btn-error'
					: 'btn-outline'}"
			>
				🎄 {filters.is_christmas_beer === 'True' ? 'Viser kun juleøl' : 'Vis kun juleøl'}
			</button>
		</div>
	{/if}

	<RangeFilter
		title="Pris"
		bind:fromValue={filters.priceFrom}
		bind:toValue={filters.priceTo}
		step={25}
		unit="kr"
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('priceFrom', 'priceTo')}
	/>

	<RangeFilter
		title="Pris per liter"
		bind:fromValue={filters.pricePerLiterFrom}
		bind:toValue={filters.pricePerLiterTo}
		step={50}
		unit="kr/l"
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('pricePerLiterFrom', 'pricePerLiterTo')}
	/>

	<RangeFilter
		title="Alkohol"
		bind:fromValue={filters.abvFrom}
		bind:toValue={filters.abvTo}
		step={0.1}
		unit="%"
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('abvFrom', 'abvTo')}
	/>

	<StoreFilter bind:selectedStores bind:isOpen={openSections.store} {onFilterChange} />

	<StyleFilter bind:selectedStyles bind:isOpen={openSections.style} {onFilterChange} />

	<CountryFilter bind:selectedCountries bind:isOpen={openSections.country} {onFilterChange} />

	<ReleaseFilter bind:selectedReleases bind:isOpen={openSections.release} {onFilterChange} />

	<ProductSelectionFilter
		bind:selectedProductSelections
		bind:isOpen={openSections.productSelection}
		{onFilterChange}
	/>

	<AllergenFilter
		bind:allergenFilter={filters.allergens}
		bind:isOpen={openSections.allergens}
		{onFilterChange}
	/>

	<DeliveryFilter
		bind:selectedDeliveryOptions
		bind:isOpen={openSections.delivery}
		{onFilterChange}
	/>
</div>
