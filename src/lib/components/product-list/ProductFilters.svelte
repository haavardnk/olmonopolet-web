<script lang="ts">
	import { onMount } from 'svelte';
	import { ALLERGENS, COUNTRY_NAMES, DELIVERY_OPTIONS, PRODUCT_SELECTIONS } from '$lib/constants';
	import type { Release, Store } from '$lib/api/products';
	import FilterCollapse from '$lib/components/product-list/filters/CollapseFilter.svelte';
	import RangeFilter from '$lib/components/product-list/filters/RangeFilter.svelte';

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

	let countrySearchQuery = $state('');
	let isInternalUpdate = false;
	let releases = $state<Release[]>([]);
	let releasesLoading = $state(true);
	let selectedAllergens = $state<string[]>(parseSelectedAllergens(filters.allergens));
	let selectedCountries = $state<string[]>(filters.country ? filters.country.split(',') : []);
	let selectedDeliveryOptions = $state<string[]>(
		filters.deliveryOptions ? filters.deliveryOptions.split(',') : []
	);
	let selectedProductSelections = $state<string[]>(
		filters.productSelection ? filters.productSelection.split(',') : []
	);
	let selectedReleases = $state<string[]>(filters.release ? filters.release.split(',') : []);
	let selectedStores = $state<number[]>(filters.store ? filters.store.split(',').map(Number) : []);
	let selectedStyles = $state<string[]>(filters.style ? filters.style.split(',') : []);
	let stores = $state<Store[]>([]);
	let storesLoading = $state(true);
	let storeSearchQuery = $state('');
	let styles = $state<string[]>([]);
	let stylesLoading = $state(true);
	let styleSearchQuery = $state('');
	let userLocation = $state<{ lat: number; lng: number } | null>(null);

	let openSections = $state({
		allergens: false,
		country: false,
		delivery: false,
		productSelection: false,
		release: false,
		store: false,
		style: false
	});

	const filteredCountries = $derived(
		COUNTRY_NAMES.filter((country) =>
			country.toLowerCase().includes(countrySearchQuery.toLowerCase())
		)
	);

	const filteredStores = $derived.by(() => {
		let filtered = stores.filter((store) =>
			store.name.toLowerCase().includes(storeSearchQuery.toLowerCase())
		);

		if (selectedStores.length > 0) {
			const filteredIds = new Set(filtered.map((s) => s.store_id));
			const selectedButNotFiltered = stores.filter(
				(store) => selectedStores.includes(store.store_id) && !filteredIds.has(store.store_id)
			);
			filtered = [...selectedButNotFiltered, ...filtered];
		}

		if (userLocation) {
			const location = userLocation;
			filtered = [...filtered].sort((a, b) => {
				const distanceA = calculateDistance(location.lat, location.lng, a.gps_lat, a.gps_long);
				const distanceB = calculateDistance(location.lat, location.lng, b.gps_lat, b.gps_long);
				return distanceA - distanceB;
			});
		}

		return filtered;
	});

	const filteredStyles = $derived(
		styles.filter((style) => style.toLowerCase().includes(styleSearchQuery.toLowerCase()))
	);

	const allergenItems = $derived(
		ALLERGENS.map((allergen) => ({ value: allergen.label, label: allergen.label }))
	);

	const countryItems = $derived(
		filteredCountries.map((country) => ({ value: country, label: country }))
	);

	const deliveryItems = $derived(
		DELIVERY_OPTIONS.map((option) => ({ value: option, label: option }))
	);

	const productSelectionItems = $derived(
		PRODUCT_SELECTIONS.map((selection) => ({ value: selection.value, label: selection.label }))
	);

	const releaseItems = $derived(
		releases.map((release) => ({ value: release.name, label: release.name }))
	);

	const storeItems = $derived(
		filteredStores.map((store) => {
			const item: { value: number; label: string; meta?: string } = {
				value: store.store_id,
				label: store.name
			};

			if (userLocation) {
				const distance = calculateDistance(
					userLocation.lat,
					userLocation.lng,
					store.gps_lat,
					store.gps_long
				);
				item.meta = `${distance.toFixed(1)} km`;
			}

			return item;
		})
	);
	const styleItems = $derived(filteredStyles.map((style) => ({ value: style, label: style })));

	$effect(() => {
		if (isInternalUpdate) {
			isInternalUpdate = false;
			return;
		}
		selectedAllergens = parseSelectedAllergens(filters.allergens);
		selectedCountries = filters.country ? filters.country.split(',') : [];
		selectedDeliveryOptions = filters.deliveryOptions ? filters.deliveryOptions.split(',') : [];
		selectedProductSelections = filters.productSelection ? filters.productSelection.split(',') : [];
		selectedReleases = filters.release ? filters.release.split(',') : [];
		selectedStores = filters.store ? filters.store.split(',').map(Number) : [];
		selectedStyles = filters.style ? filters.style.split(',') : [];
	});

	onMount(async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					userLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
				},
				(error) => {
					console.warn('Location access denied or unavailable:', error);
				}
			);
		}

		try {
			const response = await fetch('/api/stores');
			const data = await response.json();
			stores = data.stores || [];
		} catch (error) {
			console.error('Failed to fetch stores:', error);
			stores = [];
		} finally {
			storesLoading = false;
		}

		try {
			const response = await fetch('/api/releases');
			const data = await response.json();
			releases = data.releases || [];
		} catch (error) {
			console.error('Failed to fetch releases:', error);
			releases = [];
		} finally {
			releasesLoading = false;
		}

		try {
			const response = await fetch('/api/styles');
			const data = await response.json();
			styles = data.styles || [];
		} catch (error) {
			console.error('Failed to fetch styles:', error);
			styles = [];
		} finally {
			stylesLoading = false;
		}
	});

	function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const R = 6371;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	function parseSelectedAllergens(filterValue: string): string[] {
		if (!filterValue) return [];
		return ALLERGENS.filter((allergen) => {
			const keywords = allergen.value.split(',').map((k) => k.trim());
			return keywords.some((keyword) => filterValue.includes(keyword));
		}).map((allergen) => allergen.label);
	}

	function resetMultiSelectFilter(
		filterKey: keyof typeof filters,
		searchQuerySetter?: (value: string) => void
	) {
		isInternalUpdate = true;
		filters[filterKey] = '';
		if (searchQuerySetter) {
			searchQuerySetter('');
		}
		onFilterChange();
		return [];
	}

	function resetRangeFilter(fromKey: keyof typeof filters, toKey: keyof typeof filters) {
		filters[fromKey] = '';
		filters[toKey] = '';
		onFilterChange();
	}

	function toggleSelection<T extends string | number>(array: T[], value: T): T[] {
		const index = array.indexOf(value);
		if (index > -1) {
			array.splice(index, 1);
		} else {
			array.push(value);
		}
		return [...array];
	}

	function updateMultiSelectFilter<T extends string | number>(
		selectedArray: T[],
		value: T,
		filterKey: keyof typeof filters
	): T[] {
		const newArray = toggleSelection(selectedArray, value);

		isInternalUpdate = true;
		if (filterKey === 'allergens') {
			const allergenKeywords = (newArray as string[])
				.map((label) => ALLERGENS.find((a) => a.label === label)?.value)
				.filter(Boolean)
				.join(',');
			filters[filterKey] = allergenKeywords;
		} else {
			filters[filterKey] = newArray.map(String).join(',');
		}

		onFilterChange();
		return newArray;
	}

	function selectAllFiltered<T extends string | number>(
		currentSelection: T[],
		filteredItems: { value: T; label: string }[],
		filterKey: keyof typeof filters
	): T[] {
		const allFilteredValues = filteredItems.map((item) => item.value);
		const newSelection = [...new Set([...currentSelection, ...allFilteredValues])];

		isInternalUpdate = true;
		filters[filterKey] = newSelection.map(String).join(',');
		onFilterChange();
		return newSelection;
	}
</script>

<div class="space-y-2">
	<RangeFilter
		title="Pris"
		bind:fromValue={filters.priceFrom}
		bind:toValue={filters.priceTo}
		unit="kr"
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('priceFrom', 'priceTo')}
	/>

	<RangeFilter
		title="Pris per liter"
		bind:fromValue={filters.pricePerLiterFrom}
		bind:toValue={filters.pricePerLiterTo}
		unit="kr"
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('pricePerLiterFrom', 'pricePerLiterTo')}
	/>

	<RangeFilter
		title="Alkoholprosent (ABV)"
		bind:fromValue={filters.abvFrom}
		bind:toValue={filters.abvTo}
		unit="%"
		min={0}
		max={100}
		step={0.1}
		onChange={onFilterChange}
		onReset={() => resetRangeFilter('abvFrom', 'abvTo')}
	/>

	<FilterCollapse
		title="Butikk"
		items={storeItems}
		bind:selectedValues={selectedStores}
		bind:isOpen={openSections.store}
		showSearch={true}
		bind:searchQuery={storeSearchQuery}
		isLoading={storesLoading}
		loadingMessage="Laster butikker..."
		emptyMessage="Ingen butikker funnet"
		onReset={() => {
			selectedStores = resetMultiSelectFilter('store', (val) => (storeSearchQuery = val));
		}}
		onChange={(value) => {
			selectedStores = updateMultiSelectFilter(selectedStores, value, 'store');
		}}
	/>

	<FilterCollapse
		title="Stil"
		items={styleItems}
		bind:selectedValues={selectedStyles}
		bind:isOpen={openSections.style}
		showSearch={true}
		bind:searchQuery={styleSearchQuery}
		isLoading={stylesLoading}
		loadingMessage="Laster stiler..."
		emptyMessage="Ingen stiler funnet"
		onReset={() => {
			selectedStyles = resetMultiSelectFilter('style', (val) => (styleSearchQuery = val));
		}}
		onChange={(value) => {
			selectedStyles = updateMultiSelectFilter(selectedStyles, value, 'style');
		}}
		onSelectAllFiltered={(items) => {
			selectedStyles = selectAllFiltered(selectedStyles, items, 'style');
		}}
	/>

	<FilterCollapse
		title="Land"
		items={countryItems}
		bind:selectedValues={selectedCountries}
		bind:isOpen={openSections.country}
		showSearch={true}
		bind:searchQuery={countrySearchQuery}
		emptyMessage="Ingen land funnet"
		onReset={() => {
			selectedCountries = resetMultiSelectFilter('country', (val) => (countrySearchQuery = val));
		}}
		onChange={(value) => {
			selectedCountries = updateMultiSelectFilter(selectedCountries, value, 'country');
		}}
	/>

	<FilterCollapse
		title="Produktutvalg"
		items={productSelectionItems}
		bind:selectedValues={selectedProductSelections}
		bind:isOpen={openSections.productSelection}
		onReset={() => {
			selectedProductSelections = resetMultiSelectFilter('productSelection');
		}}
		onChange={(value) => {
			selectedProductSelections = updateMultiSelectFilter(
				selectedProductSelections,
				value,
				'productSelection'
			);
		}}
	/>

	<FilterCollapse
		title="Uten allergener"
		items={allergenItems}
		bind:selectedValues={selectedAllergens}
		bind:isOpen={openSections.allergens}
		onReset={() => {
			selectedAllergens = resetMultiSelectFilter('allergens');
		}}
		onChange={(value) => {
			selectedAllergens = updateMultiSelectFilter(selectedAllergens, value, 'allergens');
		}}
	/>

	<FilterCollapse
		title="Leveringsmåte"
		items={deliveryItems}
		bind:selectedValues={selectedDeliveryOptions}
		bind:isOpen={openSections.delivery}
		onReset={() => {
			selectedDeliveryOptions = resetMultiSelectFilter('deliveryOptions');
		}}
		onChange={(value) => {
			selectedDeliveryOptions = updateMultiSelectFilter(
				selectedDeliveryOptions,
				value,
				'deliveryOptions'
			);
		}}
	/>

	<FilterCollapse
		title="Lansering"
		items={releaseItems}
		bind:selectedValues={selectedReleases}
		bind:isOpen={openSections.release}
		isLoading={releasesLoading}
		loadingMessage="Laster lanseringer..."
		emptyMessage="Ingen lanseringer funnet"
		onReset={() => {
			selectedReleases = resetMultiSelectFilter('release');
		}}
		onChange={(value) => {
			selectedReleases = updateMultiSelectFilter(selectedReleases, value, 'release');
		}}
	/>
</div>
