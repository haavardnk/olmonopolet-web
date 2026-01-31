<script lang="ts">
	import { page } from '$app/stores';
	import type { Product } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import { CircleAlert, Beer, Share2, User } from '@lucide/svelte';

	let token = $derived($page.params.token);
	let listName = $state('');
	let listDescription = $state<string | null>(null);
	let ownerName = $state<string | null>(null);
	let products = $state<Product[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

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
			ownerName =
				data.user_name || data.owner_name || data.user?.name || data.user?.username || null;

			const productIds: string[] = (data.product_ids || []).map(String);
			if (productIds.length > 0) {
				const prodRes = await fetch(`/api/products?ids=${productIds.join(',')}`);
				if (prodRes.ok) {
					const prodData = await prodRes.json();
					const productMap = new Map<string, Product>();
					(prodData.products || []).forEach((p: Product) => productMap.set(String(p.id), p));
					products = productIds.map((id) => productMap.get(id)).filter((p): p is Product => !!p);
				}
			} else {
				products = [];
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
			</div>
			<h1 class="text-3xl font-bold mb-2">{listName}</h1>
			{#if listDescription}
				<p class="text-base-content/70 mb-2">{listDescription}</p>
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
					<span>{products.length} {products.length === 1 ? 'produkt' : 'produkter'}</span>
				</div>
			</div>
		</div>

		{#if products.length === 0}
			<div class="text-center py-16">
				<div class="text-5xl mb-4">🍺</div>
				<h2 class="text-xl font-semibold mb-2">Ingen produkter i listen</h2>
				<p class="text-base-content/70">Listen er tom.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
				{#each products as product, index (product.id)}
					<ProductCard {product} {index} noTransition={true} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
