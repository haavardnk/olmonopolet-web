<script lang="ts">
	import { Calendar, AlertCircle, RefreshCw, Beer, Plus } from '@lucide/svelte';
	import ReleaseCard from '$lib/components/release/ReleaseCard.svelte';

	export let releases: Array<any> = [];
	export let error: { message: string; status: number } | null = null;

	let visibleCount = 5;
	let visibleReleases = releases.slice(0, visibleCount);

	$: visibleReleases = releases.slice(0, visibleCount);

	function loadMore() {
		visibleCount += 5;
	}

	function retryFetch() {
		location.reload();
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
		<h2 class="text-2xl font-bold flex items-center gap-2">
			<Calendar size={24} class="text-primary" />
			Nyhetslanseringer
		</h2>
	</div>

	{#if error}
		<!-- Error State -->
		<div class="alert alert-error shadow-lg mb-8">
			<AlertCircle size={24} />
			<div>
				<h3 class="font-bold">Kunne ikke laste data</h3>
				<div class="text-xs">{error.message} (Status: {error.status})</div>
			</div>
			<button class="btn btn-sm" on:click={retryFetch}>
				<RefreshCw size={16} />
				Prøv igjen
			</button>
		</div>
	{/if}

	{#if releases.length === 0 && !error}
		<!-- Empty State -->
		<div class="card bg-base-200 p-8 text-center">
			<div class="flex flex-col items-center gap-4">
				<Beer size={48} class="text-primary opacity-50" />
				<h3 class="font-bold text-lg">Ingen lanseringer funnet</h3>
				<p class="text-sm opacity-70">Det er ingen kommende lanseringer for øyeblikket.</p>
				<button class="btn btn-sm btn-outline mt-2" on:click={retryFetch}>
					<RefreshCw size={16} />
					Last inn på nytt
				</button>
			</div>
		</div>
	{:else}
		<!-- Releases Cards -->
		<div class="grid gap-4">
			{#each visibleReleases as release, i}
				<ReleaseCard {release} {i} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if releases.length > visibleCount}
			<div class="flex justify-center mt-8">
				<button on:click={loadMore} class="btn btn-outline btn-wide">
					<Plus size={16} class="mr-1" />
					LAST INN MER
				</button>
			</div>
		{/if}
	{/if}
</div>
