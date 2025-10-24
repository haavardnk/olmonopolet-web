<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { ArrowLeft, ExternalLink, TriangleAlert } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';
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
						<div>
							<h1 class="text-4xl font-bold text-base-content mb-2">{product.name}</h1>
							<p class="text-xl text-base-content/70">{product.style || 'Øl'}</p>

							<div class="mt-3">
								<StarRating
									rating={product.rating}
									size={20}
									showValue={true}
									checkins={product.checkins}
								/>
							</div>

							{#if product.vmpUrl || product.untappdUrl}
								<div class="flex gap-2 mt-4 text-sm">
									{#if product.vmpUrl}
										<a
											href={product.vmpUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
										>
											<ExternalLink size={16} />
											Vinmonopolet
										</a>
									{/if}
									{#if product.untappdUrl}
										<span class="opacity-50">•</span>
										<a
											href={product.untappdUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
										>
											<ExternalLink size={16} />
											Untappd
										</a>
									{/if}
								</div>
							{/if}
						</div>

						{#if product.price}
							<div class="stats stats-horizontal shadow w-full">
								<div class="stat">
									<div class="stat-title text-xs">Pris</div>
									<div class="stat-value text-primary text-2xl">{product.price.toFixed(2)} kr</div>
									<div class="stat-desc">Varenr: {product.id}</div>
								</div>
								<div class="stat">
									<div class="stat-title text-xs">Pris per liter</div>
									<div class="stat-value text-secondary text-2xl">
										{product.pricePerLiter?.toFixed(2)} kr
									</div>
									<div class="stat-desc">{product.volume} liter</div>
								</div>
							</div>
						{/if}

						<div class="grid grid-cols-2 gap-4">
							{#if product.strength}
								<div class="card bg-base-100 shadow">
									<div class="card-body p-4">
										<h3 class="font-semibold text-sm text-base-content/70">Styrke</h3>
										<p class="text-2xl font-bold">{product.strength} %</p>
									</div>
								</div>
							{/if}
							{#if product.ibu}
								<div class="card bg-base-100 shadow">
									<div class="card-body p-4">
										<h3 class="font-semibold text-sm text-base-content/70">IBU</h3>
										<p class="text-2xl font-bold">{product.ibu}</p>
									</div>
								</div>
							{/if}
							{#if product.volume}
								<div class="card bg-base-100 shadow">
									<div class="card-body p-4">
										<h3 class="font-semibold text-sm text-base-content/70">Størrelse</h3>
										<p class="text-2xl font-bold">{product.volume} L</p>
									</div>
								</div>
							{/if}
							{#if product.alcoholUnits}
								<div class="card bg-base-100 shadow">
									<div class="card-body p-4">
										<h3 class="font-semibold text-sm text-base-content/70">Alkoholenheter</h3>
										<p class="text-2xl font-bold">{product.alcoholUnits.toFixed(1)}</p>
									</div>
								</div>
							{/if}
						</div>

						{#if product.freshness != null || product.fullness != null || product.bitterness != null || product.sweetness != null}
							<div class="card bg-base-100 shadow">
								<div class="card-body">
									<h3 class="card-title text-lg mb-4">Egenskaper</h3>

									{#if product.freshness != null}
										<div class="mb-4">
											<div class="flex justify-between mb-1">
												<span class="text-sm font-semibold">Friskhet</span>
												<span class="text-sm font-bold text-success">{product.freshness}%</span>
											</div>
											<progress
												class="progress progress-success"
												value={product.freshness}
												max="100"
											></progress>
										</div>
									{/if}

									{#if product.fullness != null}
										<div class="mb-4">
											<div class="flex justify-between mb-1">
												<span class="text-sm font-semibold">Fylde</span>
												<span class="text-sm font-bold text-primary">{product.fullness}%</span>
											</div>
											<progress class="progress progress-primary" value={product.fullness} max="100"
											></progress>
										</div>
									{/if}

									{#if product.bitterness != null}
										<div class="mb-4">
											<div class="flex justify-between mb-1">
												<span class="text-sm font-semibold">Bitterhet</span>
												<span class="text-sm font-bold text-warning">{product.bitterness}%</span>
											</div>
											<progress
												class="progress progress-warning"
												value={product.bitterness}
												max="100"
											></progress>
										</div>
									{/if}

									{#if product.sweetness != null}
										<div>
											<div class="flex justify-between mb-1">
												<span class="text-sm font-semibold">Sødme</span>
												<span class="text-sm font-bold text-secondary">{product.sweetness}%</span>
											</div>
											<progress
												class="progress progress-secondary"
												value={product.sweetness}
												max="100"
											></progress>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="container mx-auto px-4 py-12">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div class="space-y-6" in:fly={{ y: 20, duration: 300, delay: 200 }}>
					{#if product.description}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title text-2xl">Beskrivelse</h2>
								<p class="text-base-content/80">{product.description}</p>
							</div>
						</div>
					{/if}

					{#if product.taste}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title">Smak</h2>
								<p class="text-base-content/80">{product.taste}</p>
							</div>
						</div>
					{/if}

					{#if product.aroma}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title">Lukt</h2>
								<p class="text-base-content/80">{product.aroma}</p>
							</div>
						</div>
					{/if}

					{#if product.color}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title">Farge</h2>
								<p class="text-base-content/80">{product.color}</p>
							</div>
						</div>
					{/if}

					{#if product.pairing}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title">Passer til</h2>
								<p class="text-base-content/80">{product.pairing}</p>
							</div>
						</div>
					{/if}
				</div>

				<div class="space-y-6" in:fly={{ y: 20, duration: 300, delay: 300 }}>
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title text-2xl mb-4">Produksjonsinformasjon</h2>

							<div class="list">
								{#if product.brewery}
									<div class="list-row">
										<span class="font-semibold">Bryggeri:</span>
										<span class="text-base-content/80">{product.brewery}</span>
									</div>
								{/if}
								{#if product.country}
									<div class="list-row">
										<span class="font-semibold">Land:</span>
										<span class="text-base-content/80">{product.country}</span>
									</div>
								{/if}
								{#if product.method}
									<div class="list-row">
										<span class="font-semibold">Metode:</span>
										<span class="text-base-content/80">{product.method}</span>
									</div>
								{/if}
								{#if product.ingredients}
									<div class="list-row">
										<span class="font-semibold">Råstoff:</span>
										<span class="text-base-content/80">{product.ingredients}</span>
									</div>
								{/if}
								{#if product.assortment}
									<div class="list-row">
										<span class="font-semibold">Utvalg:</span>
										<span class="badge badge-primary">{product.assortment}</span>
									</div>
								{/if}
							</div>
						</div>
					</div>

					{#if product.allergens}
						<div class="alert alert-warning">
							<TriangleAlert size={24} class="shrink-0" />
							<div class="flex flex-col gap-1">
								<div class="font-bold text-base">Allergen informasjon</div>
								<div class="text-sm leading-relaxed">
									Dette produktet inneholder: <span class="font-semibold">{product.allergens}</span>
								</div>
							</div>
						</div>
					{/if}
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
