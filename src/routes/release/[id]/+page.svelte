<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import ProductList from '$lib/components/product/ProductList.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import ReleaseInfo from '$lib/components/release/ReleaseInfo.svelte';
	import releaseImage from '$lib/assets/release-image.jpg';

	import { PUBLIC_SITE_TITLE, PUBLIC_SITE_URL } from '$env/static/public';

	let { data } = $props();

	let release = $derived(data.release);

	function retryFetch() {
		location.reload();
	}
</script>

<svelte:head>
	<title>Nyhetslansering {release.formatted_date} - {PUBLIC_SITE_TITLE}</title>
	<meta
		name="description"
		content={`Detaljer for lansering ${release.formatted_date} på ${PUBLIC_SITE_TITLE}`}
	/>
	<link rel="canonical" href={`${PUBLIC_SITE_URL}/release/${release.name}`} />
	<meta property="og:type" content="article" />
	<meta
		property="og:title"
		content={`Nyhetslansering ${release.formatted_date} - ${PUBLIC_SITE_TITLE}`}
	/>
	<meta
		property="og:description"
		content={`Detaljer for lansering ${release.formatted_date} på ${PUBLIC_SITE_TITLE}`}
	/>
	<meta property="og:url" content={`${PUBLIC_SITE_URL}/release/${release.name}`} />
	<meta property="og:image" content={releaseImage} />

	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Article',
			'headline': `Nyhetslansering ${release.formatted_date} - ${PUBLIC_SITE_TITLE}`,
			'description': `Detaljer for lansering ${release.formatted_date} på ${PUBLIC_SITE_TITLE}`,
			'url': `${PUBLIC_SITE_URL}/release/${release.name}`,
			'datePublished': release.release_date,
			'author': {
				'@type': 'Organization',
				'name': `${PUBLIC_SITE_TITLE}`,
				'url': `${PUBLIC_SITE_URL}`
			}
		})}
	</script>
</svelte:head>

<div class="flex-1 flex flex-col min-h-screen">
	<Header>
		<div slot="right">
			<a href="/" class="btn btn-ghost btn-sm">
				<ArrowLeft size={16} />
				Tilbake
			</a>
		</div>
	</Header>

	<main class="bg-base-100 text-base-content flex-1">
		<div class="container mx-auto px-4 py-8">
			<div class="max-w-6xl mx-auto">
				<ReleaseInfo {release} />

				<ProductList products={release.products} {retryFetch} />
			</div>
		</div>
	</main>

	<Footer />
</div>
