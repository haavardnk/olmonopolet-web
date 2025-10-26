<script lang="ts">
	import { onMount } from 'svelte';
	import type { Store } from '$lib/api/products';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedStores = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedStores: number[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let stores = $state<Store[]>([]);
	let storesLoading = $state(true);
	let storeSearchQuery = $state('');
	let userLocation = $state<{ lat: number; lng: number } | null>(null);

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
