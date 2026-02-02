<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, ChevronDown, Loader2, Search } from '@lucide/svelte';
	import { requestUserLocation, calculateDistance, formatDistance } from '$lib/utils/geolocation';
	import type { UserLocation } from '$lib/types';

	type Store = {
		store_id: number;
		name: string;
		lat: number;
		lng: number;
		distance?: number;
	};

	type Props = {
		selectedStoreId: number | null;
		onSelect: (storeId: number | null) => void;
	};

	let { selectedStoreId, onSelect }: Props = $props();

	let stores = $state<Store[]>([]);
	let isLoading = $state(true);
	let userLocation = $state<UserLocation | null>(null);
	let isOpen = $state(false);
	let searchQuery = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);

	const selectedStore = $derived(stores.find((s) => s.store_id === selectedStoreId));

	const sortedStores = $derived.by(() => {
		if (!userLocation) return stores;
		const loc = userLocation;
		return [...stores]
			.map((s) => ({
				...s,
				distance: calculateDistance(loc.lat, loc.lng, s.lat, s.lng)
			}))
			.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
	});

	const filteredStores = $derived.by(() => {
		if (!searchQuery.trim()) return sortedStores;
		const query = searchQuery.toLowerCase();
		return sortedStores.filter((s) => s.name.toLowerCase().includes(query));
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/stores');
			if (res.ok) {
				const data = await res.json();
				stores = data.stores || [];
			}
		} catch (err) {
			console.error('Failed to fetch stores:', err);
		} finally {
			isLoading = false;
		}

		requestUserLocation(
			(loc) => {
				userLocation = loc;
			},
			() => {}
		);
	});

	function openDropdown() {
		isOpen = true;
		searchQuery = '';
		setTimeout(() => searchInput?.focus(), 50);
	}

	function handleSelect(storeId: number | null) {
		onSelect(storeId);
		isOpen = false;
		searchQuery = '';
	}
</script>

<div class="dropdown dropdown-end">
	<button
		type="button"
		class="btn btn-sm btn-ghost gap-2"
		onclick={openDropdown}
		disabled={isLoading}
	>
		{#if isLoading}
			<Loader2 size={16} class="animate-spin" />
			<span>Laster butikker...</span>
		{:else}
			<MapPin size={16} />
			<span class="max-w-40 truncate">
				{selectedStore ? selectedStore.name : 'Velg butikk'}
			</span>
			<ChevronDown size={14} />
		{/if}
	</button>

	{#if isOpen && !isLoading}
		<div
			class="dropdown-content bg-base-200 rounded-box z-50 w-72 shadow-lg flex flex-col max-h-96"
		>
			<div class="p-2 border-b border-base-300">
				<div class="relative">
					<Search size={14} class="absolute left-2 top-1/2 -translate-y-1/2 text-base-content/50" />
					<input
						bind:this={searchInput}
						type="text"
						class="input input-sm w-full pl-7"
						placeholder="Søk butikk..."
						bind:value={searchQuery}
					/>
				</div>
			</div>

			<ul class="menu p-2 overflow-y-auto flex-1">
				<li>
					<button
						type="button"
						class="text-base-content/70"
						class:active={!selectedStoreId}
						onclick={() => handleSelect(null)}
					>
						Fjern valg
					</button>
				</li>
				{#each filteredStores as store}
					<li>
						<button
							type="button"
							class:active={store.store_id === selectedStoreId}
							onclick={() => handleSelect(store.store_id)}
						>
							<span class="flex-1 truncate">{store.name}</span>
							{#if store.distance !== undefined}
								<span class="text-xs opacity-60">{formatDistance(store.distance)}</span>
							{/if}
						</button>
					</li>
				{/each}
				{#if filteredStores.length === 0}
					<li class="text-center text-base-content/50 py-4">Ingen butikker funnet</li>
				{/if}
			</ul>
		</div>
	{/if}
</div>

{#if isOpen}
	<button
		type="button"
		class="fixed inset-0 z-40"
		onclick={() => {
			isOpen = false;
			searchQuery = '';
		}}
		aria-label="Lukk"
	></button>
{/if}
