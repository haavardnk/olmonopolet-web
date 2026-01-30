<script lang="ts">
	import type { Release } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { Calendar, CircleAlert, RefreshCw, Beer } from '@lucide/svelte';
	import ReleaseCard from '$lib/components/release/ReleaseCard.svelte';

	let {
		releases,
		error,
		page,
		total,
		page_size
	}: {
		releases: Release[];
		error?: { message: string; status: number } | null;
		page: number;
		total: number;
		page_size: number;
	} = $props();

	let totalPages = $derived(Math.ceil(total / page_size));

	function retryFetch() {
		location.reload();
	}

	function goToPage(p: number) {
		goto(`/?page=${p}`);
	}
</script>

<section class="max-w-4xl mx-auto" aria-label="Nyhetslanseringer">
	<div
		class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
		in:fly={{ y: 20, duration: 300 }}
	>
		<h2 class="text-2xl font-bold flex items-center gap-2">
			<Calendar size={24} class="text-primary" />
			Nyhetslanseringer
		</h2>
	</div>

	{#if error}
		<div class="alert alert-error shadow-lg mb-8">
			<CircleAlert size={24} />
			<div>
				<h3 class="font-bold">Kunne ikke laste data</h3>
				<div class="text-xs">{error.message} (Status: {error.status})</div>
			</div>
			<button class="btn btn-sm" onclick={retryFetch}>
				<RefreshCw size={16} />
				Prøv igjen
			</button>
		</div>
	{/if}

	{#if releases.length === 0 && !error}
		<div class="card bg-base-200 p-8 text-center">
			<div class="flex flex-col items-center gap-4">
				<Beer size={48} class="text-primary opacity-50" />
				<h3 class="font-bold text-lg">Ingen lanseringer funnet</h3>
				<p class="text-sm opacity-70">Det er ingen kommende lanseringer for øyeblikket.</p>
				<button class="btn btn-sm btn-outline mt-2" onclick={retryFetch}>
					<RefreshCw size={16} />
					Last inn på nytt
				</button>
			</div>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each releases as release, index}
				<ReleaseCard {release} {index} />
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="join flex justify-center mt-8">
				<button class="btn join-item" onclick={() => goToPage(page - 1)} disabled={page <= 1}
					>&laquo; Forrige</button
				>
				<span class="join-item px-4 py-2">Side {page} av {totalPages}</span>
				<button
					class="btn join-item"
					onclick={() => goToPage(page + 1)}
					disabled={page >= totalPages}>Neste &raquo;</button
				>
			</div>
		{/if}
	{/if}
</section>
