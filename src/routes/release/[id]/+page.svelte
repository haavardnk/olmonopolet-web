<script lang="ts">
	import { PUBLIC_SITE_TITLE, PUBLIC_SITE_URL, PUBLIC_FACEBOOK_URL } from '$env/static/public';
	import { ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import ReleaseInfo from '$lib/components/release/ReleaseInfo.svelte';
	import ReleaseProductList from '$lib/components/release/ReleaseProductList.svelte';

	let { data } = $props();
	let release = $derived(data.release);
	let slug = $derived(data.slug);

	let title = $derived(`Nyhetslansering ${release.formattedDate} - ${PUBLIC_SITE_TITLE}`);
	let description = $derived.by(() => {
		const stats = release.stats;
		return `Produkter i lansering: ${stats.productCount} (${stats.beerCount} øl, ${stats.ciderCount} sider, ${stats.meadCount} mjød)`;
	});

	const articleJson = $derived.by(() => {
		return {
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: title,
			description: description,
			url: `${PUBLIC_SITE_URL}/release/${slug}`,
			datePublished: release.releaseDate,
			author: {
				'@type': 'Organization',
				name: PUBLIC_SITE_TITLE,
				url: PUBLIC_SITE_URL
			}
		};
	});

	function retryFetch() {
		location.reload();
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={`${PUBLIC_SITE_URL}/release/${slug}`} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={`${PUBLIC_SITE_URL}/release/${slug}`} />
	<meta property="og:image" content={`${PUBLIC_SITE_URL}/release-image.jpg`} />
	<meta property="article:publisher" content={PUBLIC_FACEBOOK_URL} />
	<meta property="fb:pages" content="BeermonopolyNO" />
	{@html `<script type="application/ld+json">${JSON.stringify(articleJson)}</script>`}
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
				<ReleaseInfo {release} />
				<ReleaseProductList products={release.products} {retryFetch} />
			</div>
		</div>
	</main>

	<Footer />
</div>
