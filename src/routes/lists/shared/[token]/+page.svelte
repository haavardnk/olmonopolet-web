<script lang="ts">
	import { page } from '$app/stores';
	import type { Product, ListItemWithProduct, ListStats, UserList } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ListTypeBadge from '$lib/components/lists/ListTypeBadge.svelte';
	import CellarStats from '$lib/components/lists/CellarStats.svelte';
	import ShoppingTotalBar from '$lib/components/lists/ShoppingTotalBar.svelte';
	import SharedListItem from '$lib/components/lists/SharedListItem.svelte';
	import { CircleAlert, Beer, Share2, User, Calendar, MapPin, Bookmark, ArrowLeft } from '@lucide/svelte';
	import { formatLongDate, getProductCountLabel } from '$lib/utils/formatters';
	import { transformApiList } from '$lib/utils/lists';
	import { authStore } from '$lib/stores/auth.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';

	let token = $derived($page.params.token);
	let sharedList = $state<UserList | null>(null);
	let ownerName = $state<string | null>(null);
	let storeName = $state<string | null>(null);
	let listItems = $state<ListItemWithProduct[]>([]);
	let isLoading = $state(true);
	let isFollowLoading = $state(false);
	let error = $state<string | null>(null);

	const isAuthenticated = $derived(authStore.isAuthenticated);
	const isOwnList = $derived(
		!!token &&
			Array.from(listsStore.lists.values()).some(
				(l) => !l.isFollowed && l.shareToken === token
			)
	);
	const isFollowing = $derived(
		!!token &&
			Array.from(listsStore.lists.values()).some(
				(l) => l.isFollowed && l.shareToken === token
			)
	);

	const totalItems = $derived(listItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0));
	const totalPrice = $derived(
		listItems.reduce((sum, item) => {
			const price = item.product?.price ?? 0;
			const qty = item.quantity ?? 1;
			return sum + price * qty;
		}, 0)
	);

	const cellarStats = $derived.by((): ListStats | null => {
		if (!sharedList?.showVintage) return null;
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
			sharedList = transformApiList(data);
			storeName = data.store_name || null;
			ownerName =
				data.user_name || data.owner_name || data.user?.name || data.user?.username || null;

			if (data.items && Array.isArray(data.items) && data.items.length > 0) {
				const productIds = data.items.map((item: any) => String(item.product_id));
				const uniqueProductIds = [...new Set(productIds)];

				const storeParam = sharedList.selectedStoreId ? `&check_store=${sharedList.selectedStoreId}` : '';
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

	async function toggleFollow() {
		if (!isAuthenticated) return;
		isFollowLoading = true;
		try {
			const method = isFollowing ? 'DELETE' : 'POST';
			const url = `/api/lists/shared/${token}/${isFollowing ? 'unfollow' : 'follow'}/`;
			await fetch(url, { method });
			if (isFollowing) {
				const existing = Array.from(listsStore.lists.values()).find(
					(l) => l.isFollowed && l.shareToken === token
				);
				if (existing) listsStore.deleteList(existing.id);
			} else {
				const { fetchAndSetLists } = await import('$lib/utils/lists');
				await fetchAndSetLists(true);
			}
		} catch {
			// ignore
		} finally {
			isFollowLoading = false;
		}
	}
</script>

<Header showUserMenu={true}>
	{#snippet right()}
		<button onclick={() => history.back()} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
			<ArrowLeft size={16} />
			Tilbake
		</button>
	{/snippet}
</Header>

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
	{:else if sharedList}
		<div class="mb-6">
			<div class="flex items-center gap-2 text-sm text-base-content/60 mb-2">
				<Share2 size={16} />
				<span>Delt liste</span>
				<ListTypeBadge list={sharedList} />
				{#if isAuthenticated && !isOwnList}
					<button
						class="btn btn-sm btn-ghost gap-1 ml-auto"
						class:btn-active={isFollowing}
						onclick={toggleFollow}
						disabled={isFollowLoading}
					>
						{#if isFollowLoading}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							<Bookmark size={14} fill={isFollowing ? 'currentColor' : 'none'} />
						{/if}
						{isFollowing ? 'Følger' : 'Følg'}
					</button>
				{/if}
			</div>
			<h1 class="text-3xl font-bold mb-2">{sharedList.name}</h1>
			{#if sharedList.description}
				<p class="text-base-content/70 mb-2">{sharedList.description}</p>
			{/if}
			{#if sharedList.eventDate}
				<div class="flex items-center gap-2 text-base-content/70 mb-2">
					<Calendar size={16} />
					<span>{formatLongDate(sharedList.eventDate)}</span>
				</div>
			{/if}

			{#if sharedList.showVintage && cellarStats}
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
				{#if sharedList.showStore && storeName}
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
					<SharedListItem
						{item}
						showQuantity={sharedList.showQuantity}
						showStore={sharedList.showStore}
						showVintage={sharedList.showVintage}
						showPrices={sharedList.showPrices}
						selectedStoreId={sharedList.selectedStoreId}
					/>
				{/each}
			</div>

			{#if sharedList.showStore && listItems.length > 0}
				<ShoppingTotalBar {totalPrice} totalQuantity={totalItems} {storeName} />
			{/if}
		{/if}
	{/if}
</div>
