<script lang="ts">
	import type { Product } from '$lib/types';

	let { product }: { product: Product } = $props();
</script>

{#if product.price}
	<div class="stats stats-horizontal shadow w-full">
		<div class="stat">
			<div class="stat-title text-xs">Pris</div>
			<div class="stat-value text-primary text-2xl">{product.price.toFixed(2)} kr</div>
			<div class="stat-desc">Varenr: {product.id}</div>
		</div>
		<div class="stat">
			<div class="stat-title text-xs">Pris per liter</div>
			<div class="stat-value text-secondary text-2xl">
				{product.pricePerLiter?.toFixed(2)} kr
			</div>
			<div class="stat-desc">{product.volume} liter</div>
		</div>
	</div>
{/if}

<div class="grid grid-cols-2 gap-4">
	{#if product.strength}
		<div class="card bg-base-100 shadow">
			<div class="card-body p-4">
				<h3 class="font-semibold text-sm text-base-content/70">Styrke</h3>
				<p class="text-2xl font-bold">{product.strength} %</p>
			</div>
		</div>
	{/if}
	{#if product.ibu}
		<div class="card bg-base-100 shadow">
			<div class="card-body p-4">
				<h3 class="font-semibold text-sm text-base-content/70">IBU</h3>
				<p class="text-2xl font-bold">{product.ibu}</p>
			</div>
		</div>
	{/if}
	{#if product.volume}
		<div class="card bg-base-100 shadow">
			<div class="card-body p-4">
				<h3 class="font-semibold text-sm text-base-content/70">Størrelse</h3>
				<p class="text-2xl font-bold">{product.volume} L</p>
			</div>
		</div>
	{/if}
	{#if product.alcoholUnits}
		<div class="card bg-base-100 shadow">
			<div class="card-body p-4">
				<h3 class="font-semibold text-sm text-base-content/70">Alkoholenheter</h3>
				<p class="text-2xl font-bold">{product.alcoholUnits.toFixed(1)}</p>
			</div>
		</div>
	{/if}
</div>
