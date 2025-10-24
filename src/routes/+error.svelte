<script lang="ts">
	import { page } from '$app/state';
	import { Beer, ArrowLeft, RefreshCw } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';

	function retryFetch() {
		location.reload();
	}
</script>

<svelte:head>
	<title>Feil - Ølmonopolet</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Header>
		{#snippet right()}
			<a href="/" class="btn btn-ghost btn-sm">
				<ArrowLeft size={16} />
				Tilbake
			</a>
		{/snippet}
	</Header>

	<main class="bg-base-100 text-base-content flex-1">
		<div class="container mx-auto px-4 py-16">
			<div class="max-w-md mx-auto text-center">
				<Beer size={64} class="text-primary mx-auto mb-6 opacity-50" />

				<h1 class="text-4xl font-bold mb-2">{page.status || 500}</h1>

				<div class="text-xl mb-4">
					{page.error?.message || 'Det oppstod en feil'}
				</div>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/" class="btn btn-primary">
						<ArrowLeft size={16} />
						Tilbake til forsiden
					</a>

					<button onclick={retryFetch} class="btn btn-outline">
						<RefreshCw size={16} />
						Prøv igjen
					</button>
				</div>
			</div>
		</div>
	</main>
	<Footer />
</div>
