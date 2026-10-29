<script lang="ts">
	import { PUBLIC_SITE_TITLE, PUBLIC_SITE_URL } from '$env/static/public';
	import { ArrowLeft, Expand } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ReleaseProductList from '$lib/components/release/ReleaseProductList.svelte';

	let { data } = $props();

	const title = $derived(`Juleøl ${data.year} - ${PUBLIC_SITE_TITLE}`);
	const description = $derived(
		`Alle ${data.products.length} juleøl på Vinmonopolet ${data.year}, sortert etter vurdering på Untappd.`
	);
	const productsPromise = $derived(Promise.resolve(data.products));

	const itemListJson = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			name: `Juleøl ${data.year}`,
			itemListElement: data.products.slice(0, 50).map((product, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: product.name,
				url: `${PUBLIC_SITE_URL}/products/${product.id}`
			}))
		}).replace(/</g, '\\u003c')
	);

	function retryFetch() {
		location.reload();
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{PUBLIC_SITE_URL}/juleol" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{PUBLIC_SITE_URL}/release-image-christmas.jpg" />
	<meta property="og:url" content="{PUBLIC_SITE_URL}/juleol" />
	<meta property="og:site_name" content={PUBLIC_SITE_TITLE} />
	{@html `<script type="application/ld+json">${itemListJson}</script>`}
</svelte:head>

<div class="flex-1 flex flex-col min-h-screen">
	<Header>
		{#snippet right()}
			<a href="/" class="btn btn-ghost btn-sm" aria-label="Gå tilbake til forsiden">
				<ArrowLeft size={16} />
				Tilbake
			</a>
		{/snippet}
	</Header>

	<main class="bg-base-100 text-base-content flex-1">
		<div class="container mx-auto px-4 py-8">
			<div class="max-w-6xl mx-auto">
				<div class="card bg-base-200 mb-8">
					<div class="card-body flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						<div>
							<h1 class="text-xl lg:text-3xl font-bold">🎄 Juleøl {data.year}</h1>
							<p class="opacity-80 mt-2">{description}</p>
						</div>
						<a
							href="/products?is_christmas_beer=True"
							class="btn btn-outline btn-sm lg:btn-md shrink-0"
						>
							<Expand size={16} />
							Detaljert visning
						</a>
					</div>
				</div>
				<ReleaseProductList
					title="Alle juleøl"
					emptyMessage="Ingen juleøl tilgjengelig akkurat nå."
					{productsPromise}
					{retryFetch}
				/>
			</div>
		</div>
	</main>

	<Footer />
</div>
