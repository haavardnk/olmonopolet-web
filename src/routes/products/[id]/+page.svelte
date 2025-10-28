<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { ArrowLeft } from '@lucide/svelte';
	import { PUBLIC_SITE_URL, PUBLIC_SITE_TITLE } from '$env/static/public';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ProductHero from '$lib/components/product-detail/ProductHero.svelte';
	import ProductStats from '$lib/components/product-detail/ProductStats.svelte';
	import ProductCharacteristics from '$lib/components/product-detail/ProductCharacteristics.svelte';
	import ProductDetails from '$lib/components/product-detail/ProductDetails.svelte';
	import ProductProduction from '$lib/components/product-detail/ProductProduction.svelte';
	import StoreStock from '$lib/components/product-detail/StoreStock.svelte';

	let { data }: { data: PageData } = $props();
	const product = $derived(data.product);

	const hasDetails = $derived(
		product.description || product.taste || product.aroma || product.color || product.pairing
	);

	let canGoBack = $state(false);

	afterNavigate(({ from }) => {
		if (browser && from) {
			canGoBack = true;
		}
	});

	function goBack() {
		window.history.back();
	}

	const title = $derived(`${product.name} - ${PUBLIC_SITE_TITLE}`);
	const description = $derived(
		product.description ||
			`${product.name} - ${product.style || 'Øl'} fra ${product.country || 'Norge'}. ${product.strength}% alkohol, ${product.volume ? `${(product.volume * 1000).toFixed(0)} ml` : ''}.`
	);

	const productJson = $derived.by(() => {
		return {
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: product.name,
			description: description,
			image: product.image,
			brand: {
				'@type': 'Brand',
				name: product.brewery || 'Ukjent produsent'
			},
			offers: {
				'@type': 'Offer',
				price: product.price,
				priceCurrency: 'NOK',
				availability: 'https://schema.org/InStock'
			}
		};
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{PUBLIC_SITE_URL}/products/{product.id}" />
	<meta property="og:type" content="product" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{PUBLIC_SITE_URL}/products/{product.id}" />
	<meta property="og:image" content={product.image} />
	<meta property="og:site_name" content={PUBLIC_SITE_TITLE} />
	<meta property="product:price:amount" content={product.price?.toString()} />
	<meta property="product:price:currency" content="NOK" />
	{@html `<script type="application/ld+json">${JSON.stringify(productJson)}</script>`}
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header>
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
			{/if}
		{/snippet}
	</Header>

	<main class="flex-1 bg-base-100" style="padding-bottom: env(safe-area-inset-bottom);">
		<div class="bg-base-200">
			<div class="container mx-auto px-4 py-3 sm:py-6 lg:pb-12">
				<div class="grid grid-cols-1 lg:grid-cols-20 gap-3 lg:gap-4 items-start">
					<div class="lg:col-span-7" in:fly={{ y: 20, duration: 300 }}>
						<div class="flex justify-center lg:sticky lg:top-24 h-full">
							<img
								src={product.image}
								alt={product.name}
								class="w-full h-auto max-h-[40vh] lg:max-h-full object-contain rounded-box"
								loading="eager"
								decoding="async"
								fetchpriority="high"
							/>
						</div>
					</div>

					<div class="lg:col-span-13 space-y-3" in:fly={{ y: 20, duration: 300, delay: 100 }}>
						<ProductHero {product} />
						<ProductStats {product} />
						<ProductCharacteristics {product} />
					</div>
				</div>
			</div>
		</div>

		<div class="container mx-auto px-4 py-6 sm:py-12">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{#if hasDetails}
					<div in:fly={{ y: 20, duration: 300, delay: 200 }}>
						<ProductDetails {product} />
					</div>
				{/if}

				<div
					in:fly={{ y: 20, duration: 300, delay: 300 }}
					class={!hasDetails ? 'lg:col-span-2' : ''}
				>
					<ProductProduction {product} />
				</div>
			</div>
		</div>

		<div
			class="bg-base-200 py-12"
			in:fly={{ y: 20, duration: 300, delay: 400 }}
			id="stores-section"
		>
			<div class="container mx-auto px-4">
				<StoreStock stores={product.stores} />
			</div>
		</div>
	</main>

	<Footer />
</div>
