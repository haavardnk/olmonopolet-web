<script lang="ts">
	import { page } from '$app/stores';
	import type { Product, ListType, ListItemWithProduct, ListStats } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ListTypeBadge from '$lib/components/lists/ListTypeBadge.svelte';
	import CellarStats from '$lib/components/lists/CellarStats.svelte';
	import ShoppingTotalBar from '$lib/components/lists/ShoppingTotalBar.svelte';
	import SharedListItem from '$lib/components/lists/SharedListItem.svelte';
	import { CircleAlert, Beer, Share2, User, Calendar, MapPin } from '@lucide/svelte';
	import { formatLongDate, getProductCountLabel } from '$lib/utils/formatters';

	let token = $derived($page.params.token);
	let listName = $state('');
	let listDescription = $state<string | null>(null);
	let ownerName = $state<string | null>(null);
	let listType = $state<ListType>('standard');
	let eventDate = $state<string | null>(null);
	let selectedStoreId = $state<number | null>(null);
	let storeName = $state<string | null>(null);
	let listItems = $state<ListItemWithProduct[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	const isShopping = $derived(listType === 'shopping');
	const isCellar = $derived(listType === 'cellar');
	const isEvent = $derived(listType === 'event');

	const totalItems = $derived(listItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0));
	const totalPrice = $derived(
		listItems.reduce((sum, item) => {
			const price = item.product?.price ?? 0;
			const qty = item.quantity ?? 1;
			return sum + price * qty;
		}, 0)
	);

	const cellarStats = $derived.by((): ListStats | null => {
		if (!isCellar) return null;
		const years = listItems.map((i) => i.year).filter((y): y is number => y !== null);
		return {
			totalBottles: totalItems,
			totalValue: totalPrice,
			oldestYear: years.length > 0 ? Math.min(...years) : null,
			newestYear: years.length > 0 ? Math.max(...years) : null
		};
	});

	$effect(() => {
		if (token) fetchSharedList();
	});

	async function fetchSharedList() {
		isLoading = true;
		error = null;
		try {
			const res = await fetch(`/api/lists/shared/${token}`);
			if (!res.ok)
				throw new Error(
					res.status === 404
						? 'Listen ble ikke funnet eller er ikke delt'
						: 'Kunne ikke hente listen'
				);

			const data = await res.json();
			listName = data.name;
			listDescription = data.description;
			listType = data.list_type || 'standard';
			eventDate = data.event_date || null;
			selectedStoreId = data.selected_store_id || null;
			storeName = data.store_name || null;
			ownerName =
				data.user_name || data.owner_name || data.user?.name || data.user?.username || null;

			if (data.items && Array.isArray(data.items) && data.items.length > 0) {
				const productIds = data.items.map((item: any) => String(item.product_id));
				const uniqueProductIds = [...new Set(productIds)];

				const storeParam = selectedStoreId ? `&check_store=${selectedStoreId}` : '';
				const prodRes = await fetch(`/api/products?ids=${uniqueProductIds.join(',')}${storeParam}`);
				const productMap = new Map<string, Product>();
				if (prodRes.ok) {
					const prodData = await prodRes.json();
					(prodData.products || []).forEach((p: Product) => productMap.set(String(p.id), p));
				}

				listItems = data.items.map((item: any) => ({
					id: String(item.id),
					productId: String(item.product_id),
					quantity: item.quantity ?? 1,
					year: item.year ?? null,
					notes: item.notes ?? null,
					sortOrder: item.sort_order ?? 0,
					createdAt: item.created_at ?? new Date().toISOString(),
					product: productMap.get(String(item.product_id)) ?? null
				}));
			} else {
				listItems = [];
			}
		} catch (err: any) {
			error = err.message || 'En feil oppstod';
		} finally {
			isLoading = false;
		}
	}
</script>

<Header showUserMenu={true} />

<div class="container mx-auto px-4 py-8 max-w-6xl">
	{#if isLoading}
		<div class="flex justify-center py-16">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<CircleAlert size={20} />
			<span>{error}</span>
		</div>
		<div class="mt-4">
			<a href="/products" class="btn btn-ghost">Utforsk produkter</a>
		</div>
	{:else}
		<div class="mb-6">
			<div class="flex items-center gap-2 text-sm text-base-content/60 mb-2">
				<Share2 size={16} />
				<span>Delt liste</span>
				<ListTypeBadge {listType} />
			</div>
			<h1 class="text-3xl font-bold mb-2">{listName}</h1>
			{#if listDescription}
				<p class="text-base-content/70 mb-2">{listDescription}</p>
			{/if}
			{#if isEvent && eventDate}
				<div class="flex items-center gap-2 text-base-content/70 mb-2">
					<Calendar size={16} />
					<span>{formatLongDate(eventDate)}</span>
				</div>
			{/if}

			{#if isCellar && cellarStats}
				<CellarStats stats={cellarStats} />
			{/if}

			<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60">
				{#if ownerName}
					<div class="flex items-center gap-1">
						<User size={16} />
						<span>Delt av {ownerName}</span>
					</div>
				{/if}
				<div class="flex items-center gap-1">
					<Beer size={16} />
					<span>{getProductCountLabel(totalItems)}</span>
				</div>
				{#if isShopping && storeName}
					<div class="flex items-center gap-1">
						<MapPin size={16} />
						<span>{storeName}</span>
					</div>
				{/if}
			</div>
		</div>

		{#if listItems.length === 0}
			<div class="text-center py-16">
				<div class="text-5xl mb-4">🍺</div>
				<h2 class="text-xl font-semibold mb-2">Ingen produkter i listen</h2>
				<p class="text-base-content/70">Listen er tom.</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each listItems as item (item.id)}
					<SharedListItem {item} {listType} {selectedStoreId} />
				{/each}
			</div>

			{#if isShopping && listItems.length > 0}
				<ShoppingTotalBar {totalPrice} totalQuantity={totalItems} {storeName} />
			{/if}
		{/if}
	{/if}
</div>
