<script lang="ts">
	import type { Store } from '$lib/types';
	import { Search, Info } from '@lucide/svelte';

	let {
		stores
	}: {
		stores: Store[];
	} = $props();

	let storeSearch = $state('');
	let currentPage = $state(1);
	let storesPerPage = 10;

	let filteredStores = $derived(
		stores.filter((store: { name: string; stock: number }) =>
			store.name.toLowerCase().includes(storeSearch.toLowerCase())
		)
	);

	let totalPages = $derived(Math.ceil(filteredStores.length / storesPerPage));
	let paginatedStores = $derived(
		filteredStores.slice((currentPage - 1) * storesPerPage, currentPage * storesPerPage)
	);

	$effect(() => {
		storeSearch;
		currentPage = 1;
	});

	function goToPage(page: number) {
		currentPage = page;
		document.getElementById('stores-section')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
			<h2 class="text-2xl font-bold text-base-content">
				Butikker med varen på lager
				{#if stores.length > 0}
					<span class="text-base font-normal opacity-70">({stores.length})</span>
				{/if}
			</h2>
		</div>

		{#if stores.length > 0}
			<div class="mb-4">
				<label class="input input-bordered input-sm flex items-center gap-2">
					<Search size={16} class="opacity-70" />
					<input
						type="text"
						class="grow"
						placeholder="Søk etter butikk..."
						bind:value={storeSearch}
						aria-label="Søk etter butikk"
					/>
				</label>
				{#if storeSearch}
					<p class="text-xs text-base-content/70 mt-2">
						Viser {filteredStores.length} av {stores.length} butikker
					</p>
				{/if}
			</div>

			{#if filteredStores.length > 0}
				<div class="overflow-x-auto">
					<table class="table table-sm table-zebra">
						<thead>
							<tr>
								<th class="w-full">Butikknavn</th>
								<th class="text-right whitespace-nowrap">På lager</th>
							</tr>
						</thead>
						<tbody>
							{#each paginatedStores as store}
								<tr>
									<td class="font-medium">{store.name}</td>
									<td class="text-right">
										<div
											class="badge badge-sm {store.stock > 10
												? 'badge-success'
												: store.stock > 5
													? 'badge-warning'
													: 'badge-error'}"
										>
											{store.stock}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if totalPages > 1}
					<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
						<div class="text-sm text-base-content/70">
							Viser {(currentPage - 1) * storesPerPage + 1}-{Math.min(
								currentPage * storesPerPage,
								filteredStores.length
							)} av {filteredStores.length}
						</div>
						<div class="join">
							<button
								class="btn btn-sm join-item"
								onclick={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
							>
								«
							</button>
							{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								if (totalPages <= 5) return i + 1;
								if (currentPage <= 3) return i + 1;
								if (currentPage >= totalPages - 2) return totalPages - 4 + i;
								return currentPage - 2 + i;
							}) as page}
								<button
									class="btn btn-sm join-item"
									class:btn-active={page === currentPage}
									onclick={() => goToPage(page)}
								>
									{page}
								</button>
							{/each}
							<button
								class="btn btn-sm join-item"
								onclick={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								»
							</button>
						</div>
					</div>
				{/if}
			{:else}
				<div class="alert alert-info">
					<Info size={24} />
					<span>Ingen butikker matchet søket "{storeSearch}"</span>
				</div>
			{/if}
		{:else}
			<div class="alert alert-info">
				<Info size={24} />
				<span>Dette produktet er for øyeblikket ikke på lager i noen butikker.</span>
			</div>
		{/if}
	</div>
</div>
