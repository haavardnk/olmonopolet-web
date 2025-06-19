<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import ProductList from '$lib/components/product/ProductList.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import ReleaseInfo from '$lib/components/release/ReleaseInfo.svelte';

	let { data } = $props();

	let release = $state(data.release);

	function retryFetch() {
		location.reload();
	}
</script>

<svelte:head>
	<title>{release.name} - Ølmonopolet</title>
	<meta name="description" content="Detaljer for {release.name} lansering på Ølmonopolet" />
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
