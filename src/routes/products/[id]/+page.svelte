<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ProductHero from '$lib/components/product/ProductHero.svelte';
	import ProductStats from '$lib/components/product/ProductStats.svelte';
	import ProductCharacteristics from '$lib/components/product/ProductCharacteristics.svelte';
	import ProductDetails from '$lib/components/product/ProductDetails.svelte';
	import ProductProduction from '$lib/components/product/ProductProduction.svelte';
	import StoreStock from '$lib/components/product/StoreStock.svelte';

	let { data }: { data: PageData } = $props();
	const product = $derived(data.product);

	let canGoBack = $state(false);

	$effect(() => {
		if (browser) {
			canGoBack = sessionStorage.getItem('hasNavigated') === 'true';
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

	<main class="flex-1 bg-base-100">
		<div class="bg-base-200">
			<div class="container mx-auto px-4 py-8">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
					<div class="space-y-4" in:fly={{ y: 20, duration: 300 }}>
						<div class="flex justify-center">
							<img
								src={product.image}
								alt={product.name}
								class="w-full h-auto max-h-[40vh] lg:max-h-[80vh] object-contain rounded-box"
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
				{#if product.description || product.taste || product.aroma || product.color || product.pairing}
					<div in:fly={{ y: 20, duration: 300, delay: 200 }}>
						<ProductDetails {product} />
					</div>
				{/if}

				<div
					in:fly={{ y: 20, duration: 300, delay: 300 }}
					class={!(
						product.description ||
						product.taste ||
						product.aroma ||
						product.color ||
						product.pairing
					)
						? 'lg:col-span-2'
						: ''}
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
