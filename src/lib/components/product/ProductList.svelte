<script lang="ts">
	import { Beer, RefreshCw } from '@lucide/svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import orderBy from 'lodash/orderBy';

	export let products: Array<any> = [];
	export let retryFetch: () => void;

	let sortKey = 'rating';
	let sortOrder: 'desc' | 'asc' = 'desc';

	const sortOptions = [
		{ key: 'rating', label: 'Vurdering' },
		{ key: 'price', label: 'Pris' },
		{ key: 'abv', label: 'ABV' },
		{ key: 'volume', label: 'Volum' },
		{ key: 'vmp_name', label: 'Navn' }
	];

	let sortedProducts = orderBy(products, [sortKey], [sortOrder]);

	$: sortedProducts = orderBy(
		[...products],
		(product) => {
			let value = product[sortKey];
			if (value == null) return 1;
			if (typeof value === 'string') {
				return value.toLowerCase();
			}
			return value;
		},
		sortOrder === 'asc' ? 'asc' : 'desc'
	);

	function setSortKey(val: string) {
		sortKey = val;
	}
	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
	}
</script>

<section class="mb-6" aria-label="Produkter i lansering">
	<h2 class="text-2xl font-bold mb-6">Produkter i lansering</h2>

	<div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
		<label for="sortKey" class="font-semibold">Sorter etter:</label>
		<div class="flex flex-row gap-2">
			<select
				id="sortKey"
				bind:value={sortKey}
				class="select select-sm select-bordered sm:min-w-[300px]"
				on:change={(e) => setSortKey((e.target as HTMLSelectElement).value)}
			>
				{#each sortOptions as opt}
					<option value={opt.key}>{opt.label}</option>
				{/each}
			</select>
			<button class="btn btn-sm btn-outline" on:click={toggleSortOrder}>
				{sortOrder === 'asc' ? '↑' : '↓'}
			</button>
		</div>
	</div>

	{#if products.length === 0}
		<div class="card bg-base-200 p-8 text-center">
			<div class="flex flex-col items-center gap-4">
				<Beer size={48} class="text-primary opacity-50" />
				<h3 class="font-bold text-lg">Ingen produkter funnet</h3>
				<p class="text-sm opacity-70">Det er ingen produkter tilgjengelig for denne lanseringen.</p>
				<button class="btn btn-sm btn-outline mt-2" on:click={retryFetch}>
					<RefreshCw size={16} />
					Last inn på nytt
				</button>
			</div>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each sortedProducts as product, index}
				<ProductCard {product} {index} />
			{/each}
		</div>
	{/if}
</section>
