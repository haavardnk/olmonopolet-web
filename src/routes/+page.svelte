<script lang="ts">
	import Footer from '$lib/components/common/Footer.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import HeroSection from '$lib/components/common/HeroSection.svelte';
	import ReleaseList from '$lib/components/release/ReleaseList.svelte';

	import { PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_DESCRIPTION } from '$env/static/public';
	import { slugify } from '$lib/utils/helpers';

	let { data } = $props();

	let releases = $derived(data.releases || []);
	let error = $derived(data.error || null);
	let page = $derived(data.page || 1);
	let total = $derived(data.total || 0);
	let page_size = $derived(data.page_size || 5);

	const itemListJson = $derived.by(() => {
		if (releases.length === 0) return null;
		return {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: releases.map((release, i) => {
				const stats = release.stats;
				const description = `Produkter i lansering: ${stats.productCount} (${stats.beerCount} øl, ${stats.ciderCount} sider, ${stats.meadCount} mjød)`;

				return {
					'@type': 'ListItem',
					position: i + 1,
					item: {
						'@type': 'Thing',
						name: `Nyhetslansering ${release.formattedDate}`,
						url: `${PUBLIC_SITE_URL}/release/${slugify(release.name)}`,
						description
					}
				};
			})
		};
	});
</script>

<svelte:head>
	<title>{PUBLIC_SITE_TITLE}</title>
	<meta name="description" content={PUBLIC_SITE_DESCRIPTION} />
	<link rel="canonical" href={PUBLIC_SITE_URL} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={PUBLIC_SITE_TITLE} />
	<meta property="og:description" content={PUBLIC_SITE_DESCRIPTION} />
	<meta property="og:url" content={PUBLIC_SITE_URL} />
	<meta property="og:image" content="{PUBLIC_SITE_URL}/icon.png" />
	<meta property="og:site_name" content={PUBLIC_SITE_TITLE} />
	{#if itemListJson}
		{@html `<script type="application/ld+json">${JSON.stringify(itemListJson)}</script>`}
	{/if}
</svelte:head>

<div class="min-h-screen">
	<Header showSocialLinks={true} showMenu={true} />
	<main class="bg-base-100 text-base-content">
		<HeroSection />
		<div class="container mx-auto px-4 py-8">
			<div class="max-w-6xl mx-auto">
				<ReleaseList {releases} {error} {page} {total} {page_size} />
			</div>
		</div>
	</main>
	<Footer />
</div>
