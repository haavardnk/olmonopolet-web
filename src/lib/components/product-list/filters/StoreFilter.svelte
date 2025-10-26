<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApiStore } from '$lib/types';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';
	import { calculateDistance, requestUserLocation } from '$lib/utils/geolocation';
	import type { UserLocation } from '$lib/types';

	let {
		selectedStores = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedStores: number[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let stores = $state<ApiStore[]>([]);
	let storesLoading = $state(true);
	let storeSearchQuery = $state('');
	let userLocation = $state<UserLocation | null>(null);

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
				const distanceA = calculateDistance(location.lat, location.lng, a.lat, a.lng);
				const distanceB = calculateDistance(location.lat, location.lng, b.lat, b.lng);
				return distanceA - distanceB;
			});
		}

		return filtered;
	});

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
					store.lat,
					store.lng
				);
				item.meta = `${distance.toFixed(1)} km`;
			}
			return item;
		})
	);

	onMount(async () => {
		requestUserLocation((location) => {
			userLocation = location;
		});

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
	});

	function handleReset() {
		selectedStores = [];
		storeSearchQuery = '';
		onFilterChange();
	}

	function handleChange(value: number) {
		const index = selectedStores.indexOf(value);
		if (index > -1) {
			selectedStores.splice(index, 1);
		} else {
			selectedStores.push(value);
		}
		selectedStores = [...selectedStores];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Butikk"
	items={storeItems}
	bind:selectedValues={selectedStores}
	bind:isOpen
	showSearch={true}
	bind:searchQuery={storeSearchQuery}
	isLoading={storesLoading}
	loadingMessage="Laster butikker..."
	emptyMessage="Ingen butikker funnet"
	onReset={handleReset}
	onChange={handleChange}
/>
