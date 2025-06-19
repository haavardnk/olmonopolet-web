<script lang="ts">
	import Footer from '$lib/components/common/Footer.svelte';
	import Header from '$lib/components/common/Header.svelte';
	import HeroSection from '$lib/components/common/HeroSection.svelte';
	import ReleaseList from '$lib/components/release/ReleaseList.svelte';

	let { data } = $props();

	let releases = $derived(data?.releases ? data.releases : []);
	let error = $derived(data?.error || null);
	let page = $derived(data?.page || 1);
	let total = $derived(data?.total || 0);
	let page_size = $derived(data?.page_size || 5);
</script>

<svelte:head>
	<title>Ølmonopolet</title>
</svelte:head>

<div class="min-h-screen">
	<Header showSocialLinks={true} showMenu={true} />
	<main class="bg-base-100 text-base-content">
		<HeroSection />
		<div class="container mx-auto px-4 py-8">
			<ReleaseList {releases} {error} {page} {total} {page_size} />
		</div>
	</main>
	<Footer />
</div>
