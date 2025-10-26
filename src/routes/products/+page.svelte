<script lang="ts">
	import Header from '$lib/components/common/Header.svelte';
	import ProductList from '$lib/components/product-list/ProductList.svelte';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { ArrowLeft } from '@lucide/svelte';

	let { data } = $props();

	const hasSavedState = browser && sessionStorage.getItem('products-data') !== null;

	let currentPage = $state(data.page || 1);
	let hasMore = $state(data.hasMore || false);
	let loading = $state(false);
	let products = $state(data.products || []);
	let canGoBack = $state(browser && sessionStorage.getItem('hasNavigated') === 'true');

	const total = $derived(data.total || 0);

	function goBack() {
		window.history.back();
	}

	afterNavigate(({ from }) => {
		if (browser && from?.route.id?.startsWith('/products/')) {
			const savedScroll = sessionStorage.getItem('products-scroll');
			const savedData = sessionStorage.getItem('products-data');

			if (savedData) {
				try {
					const parsed = JSON.parse(savedData);

					if (parsed.searchParams === data.searchParams.toString()) {
						products = parsed.products;
						currentPage = parsed.currentPage;
						hasMore = parsed.hasMore;

						if (savedScroll) {
							requestAnimationFrame(() => {
								const scrollElement = document.querySelector('[data-infinite-wrapper]');
								if (scrollElement) {
									scrollElement.scrollTop = parseInt(savedScroll);
								}
							});
						}
					}
				} catch (e) {
					console.error('Failed to restore state:', e);
				} finally {
					sessionStorage.removeItem('products-scroll');
					sessionStorage.removeItem('products-data');
				}
			}
		}
	});

	beforeNavigate(({ willUnload, to }) => {
		if (!willUnload && to?.route.id?.startsWith('/products/')) {
			if (browser) {
				const scrollElement = document.querySelector('[data-infinite-wrapper]');
				const scrollPos = scrollElement?.scrollTop || 0;

				sessionStorage.setItem('products-scroll', scrollPos.toString());
				sessionStorage.setItem(
					'products-data',
					JSON.stringify({
						products,
						currentPage,
						hasMore,
						searchParams: data.searchParams.toString()
					})
				);
			}
		}
	});

	async function loadMore(currentSearchParams: URLSearchParams) {
		if (loading || !hasMore) return;

		loading = true;
		const nextPage = currentPage + 1;

		try {
			const params = new URLSearchParams(currentSearchParams);
			params.set('page', nextPage.toString());

			const response = await fetch(`/api/products?${params.toString()}`);

			if (!response.ok) {
				throw new Error('Failed to fetch products');
			}

			const result = await response.json();

			const existingIds = new Set(products.map((p) => p.id));
			const newProducts = result.products.filter((p: any) => !existingIds.has(p.id));

			products = [...products, ...newProducts];
			currentPage = nextPage;
			hasMore = result.hasMore;
		} catch (error) {
			console.error('Error loading more products:', error);
			throw error;
		} finally {
			loading = false;
		}
	}

	let previousSearchParams = $state(data.searchParams.toString());

	$effect(() => {
		const newProducts = data.products || [];
		const newPage = data.page || 1;
		const newHasMore = data.hasMore || false;
		const currentSearchParams = data.searchParams.toString();

		if (currentSearchParams !== previousSearchParams || (!hasSavedState && newPage === 1)) {
			products = newProducts;
			currentPage = newPage;
			hasMore = newHasMore;
			previousSearchParams = currentSearchParams;
		}
	});
</script>

<svelte:head>
	<title>Produktoversikt - Ølmonopolet</title>
	<meta
		name="description"
		content="Utforsk alle produkter fra Vinmonopolet. Søk, filtrer og sorter etter pris, stil, land, alkoholprosent og mer."
	/>
	<link rel="canonical" href="{PUBLIC_SITE_URL}/products" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Produktoversikt - Ølmonopolet" />
	<meta
		property="og:description"
		content="Utforsk alle produkter fra Vinmonopolet. Søk, filtrer og sorter etter pris, stil, land, alkoholprosent og mer."
	/>
	<meta property="og:url" content="{PUBLIC_SITE_URL}/products" />
</svelte:head>

<div class="h-screen flex flex-col">
	<Header showSocialLinks={false} showMenu={false}>
		{#snippet right()}
			{#if canGoBack}
				<button
					onclick={goBack}
					class="btn btn-ghost btn-sm"
					aria-label="Gå tilbake til forrige side"
				>
					<ArrowLeft size={16} />
					Tilbake
				</button>
			{:else}
				<a href="/" class="btn btn-ghost btn-sm" aria-label="Gå tilbake til forsiden">
					<ArrowLeft size={16} />
					Tilbake
				</a>
			{/if}
		{/snippet}
	</Header>

	<div class="flex-1 overflow-hidden" in:fly={{ y: 20, duration: 300 }}>
		<ProductList {hasMore} {loadMore} {products} {total} searchParams={data.searchParams} />
	</div>
</div>
