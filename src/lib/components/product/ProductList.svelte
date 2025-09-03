<script lang="ts">
	import { Beer, RefreshCw, Funnel, ArrowUpDown } from '@lucide/svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import orderBy from 'lodash/orderBy';

	export let products: Array<any> = [];
	export let retryFetch: () => void;

	let sortKey = 'rating';
	let sortOrder: 'desc' | 'asc' = 'desc';
	let selectedStyle = 'alle';
	let styleSearchTerm = '';

	const sortOptions = [
		{ key: 'rating', label: 'Vurdering' },
		{ key: 'price', label: 'Pris' },
		{ key: 'abv', label: 'ABV' },
		{ key: 'volume', label: 'Volum' },
		{ key: 'vmp_name', label: 'Navn' }
	];

	let sortedProducts = orderBy(products, [sortKey], [sortOrder]);

	$: uniqueStyles = Array.from(
		new Set(
			products
				.map((p) => p.style)
				.filter((style) => style && style.trim() !== '')
				.map((style) => {
					if (style.startsWith('Belgian')) {
						return 'Belgian';
					}
					return style.split(' - ')[0].trim();
				})
		)
	).sort();

	$: filteredStyles = uniqueStyles.filter((style) =>
		style.toLowerCase().includes(styleSearchTerm.toLowerCase())
	);

	$: filteredProducts =
		selectedStyle === 'alle'
			? products
			: products.filter((product) => {
					if (!product.style) return false;
					if (selectedStyle === 'Belgian') {
						return product.style.startsWith('Belgian');
					}
					return product.style.split(' - ')[0].trim() === selectedStyle;
				});

	$: sortedProducts = orderBy(
		filteredProducts,
		(product) => {
			const value = product[sortKey];
			return value == null ? 1 : typeof value === 'string' ? value.toLowerCase() : value;
		},
		sortOrder
	);

	function setSortKey(val: string) {
		sortKey = val;
	}
	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
	}
	function setStyleFilter(style: string) {
		selectedStyle = style;
		styleSearchTerm = '';
	}
</script>

<section class="mb-6" aria-label="Produkter i lansering">
	<h2 class="text-2xl font-bold mb-6">Produkter i lansering</h2>

	<div class="mb-4 flex flex-row gap-3 items-center justify-between">
		<div class="join">
			<div class="relative">
				<ArrowUpDown
					size={16}
					class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
				/>
				<select
					id="sortKey"
					bind:value={sortKey}
					class="select select-sm select-bordered join-item pl-10 w-36 sm:w-48"
					on:change={(e) => setSortKey((e.target as HTMLSelectElement).value)}
				>
					{#each sortOptions as opt}
						<option value={opt.key}>{opt.label}</option>
					{/each}
				</select>
			</div>
			<button class="btn btn-sm join-item" on:click={toggleSortOrder}>
				{sortOrder === 'asc' ? '↑' : '↓'}
			</button>
		</div>

		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-sm gap-2">
				<Funnel size={16} />
				{selectedStyle === 'alle' ? 'Alle stiler' : selectedStyle}
			</div>
			<div
				class="dropdown-content bg-base-100 rounded-box z-[1] w-64 p-2 shadow border border-base-300 mt-1"
			>
				<div class="p-2">
					<input
						type="text"
						placeholder="Søk etter stil..."
						class="input input-sm input-bordered w-full mb-2"
						bind:value={styleSearchTerm}
					/>
				</div>
				<div class="max-h-48 overflow-y-auto">
					<ul class="menu menu-sm">
						<li>
							<button
								class="flex items-center gap-2 p-2 hover:bg-base-200 rounded w-full text-left {selectedStyle ===
								'alle'
									? 'active'
									: ''}"
								on:click={() => setStyleFilter('alle')}
							>
								<input
									type="radio"
									name="style-filter"
									class="radio radio-sm"
									checked={selectedStyle === 'alle'}
									readonly
								/>
								<span class="flex-1">Alle stiler</span>
								<span class="badge badge-sm badge-outline">
									{products.length}
								</span>
							</button>
						</li>
						{#each filteredStyles as style}
							<li>
								<button
									class="flex items-center gap-2 p-2 hover:bg-base-200 rounded w-full text-left {selectedStyle ===
									style
										? 'active'
										: ''}"
									on:click={() => setStyleFilter(style)}
								>
									<input
										type="radio"
										name="style-filter"
										class="radio radio-sm"
										checked={selectedStyle === style}
										readonly
									/>
									<span class="flex-1">{style}</span>
									<span class="badge badge-sm badge-outline">
										{products.filter((p) => {
											if (!p.style) return false;
											if (style === 'Belgian') {
												return p.style.startsWith('Belgian');
											}
											return p.style.split(' - ')[0].trim() === style;
										}).length}
									</span>
								</button>
							</li>
						{/each}
						{#if filteredStyles.length === 0 && styleSearchTerm}
							<li>
								<div class="px-4 py-2 text-sm opacity-70">Ingen stiler funnet</div>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	</div>

	{#if filteredProducts.length === 0 && products.length > 0}
		<div class="card bg-base-200 p-8 text-center">
			<div class="flex flex-col items-center gap-4">
				<Funnel size={48} class="text-primary opacity-50" />
				<h3 class="font-bold text-lg">Ingen produkter funnet</h3>
				<p class="text-sm opacity-70">Ingen produkter matcher det valgte filteret.</p>
				<button class="btn btn-sm btn-outline mt-2" on:click={() => setStyleFilter('alle')}>
					Vis alle produkter
				</button>
			</div>
		</div>
	{:else if products.length === 0}
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
		<div class="grid grid-cols-1 gap-4">
			{#each sortedProducts as product, index}
				<ProductCard {product} {index} />
			{/each}
		</div>
	{/if}
</section>
