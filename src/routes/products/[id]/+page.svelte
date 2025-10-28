<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { ArrowLeft } from '@lucide/svelte';
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
</script>

<svelte:head>
	<title>{product.name} - Ølmonopolet</title>
	<meta name="description" content={product.description} />
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
			<div class="container mx-auto px-4 py-4 sm:py-8">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
					<div class="space-y-4" in:fly={{ y: 20, duration: 300 }}>
						<div class="flex justify-center">
							<img
								src={product.image}
								alt={product.name}
								class="w-full h-auto max-h-[40vh] lg:max-h-[80vh] object-contain rounded-box"
								style="clip-path: inset(0 round 0.5rem)"
								loading="eager"
								decoding="async"
								fetchpriority="high"
							/>
						</div>
					</div>

					<div class="space-y-6" in:fly={{ y: 20, duration: 300, delay: 100 }}>
						<ProductHero {product} />
						<ProductStats {product} />
						<ProductCharacteristics {product} />
					</div>
				</div>
			</div>
		</div>

		<div class="container mx-auto px-4 py-12">
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
