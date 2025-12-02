<script lang="ts">
	import type { Product } from '$lib/types';
	import { Star } from '@lucide/svelte';

	let { product }: { product: Product } = $props();

	const valueScoreInfo = $derived.by(() => {
		if (!product.valueScore) return null;

		if (product.valueScore >= 15) return { color: 'text-success' };
		if (product.valueScore >= 10) return { color: 'text-info' };
		if (product.valueScore >= 5) return { color: 'text-warning' };
		return { color: 'text-error' };
	});

	const specsCount = $derived(
		[
			product.strength,
			product.ibu,
			product.volume,
			product.alcoholUnits,
			product.sugar,
			product.acid
		].filter(Boolean).length
	);

	const gridCols = $derived.by(() => {
		if (specsCount >= 4) return 'lg:grid-cols-4';
		if (specsCount === 3) return 'lg:grid-cols-3';
		return 'lg:grid-cols-2';
	});
</script>

<div class="space-y-3">
	{#if product.price}
		<div class="stats stats-horizontal shadow w-full">
			<div class="stat py-3">
				<div class="stat-title text-xs">Pris</div>
				<div class="stat-value text-primary text-xl sm:text-2xl">
					{product.price.toFixed(2)} kr
				</div>
				<div class="stat-desc text-xs">Varenr: {product.id}</div>
			</div>
			<div class="stat py-3">
				<div class="stat-title text-xs">Pris per liter</div>
				<div class="stat-value text-secondary text-xl sm:text-2xl">
					{product.pricePerLiter?.toFixed(2)} kr
				</div>
				<div class="stat-desc text-xs">{product.volume} liter</div>
			</div>
		</div>
	{/if}

	{#if product.pricePerAlcoholUnit || product.valueScore}
		<div class="stats stats-horizontal shadow w-full">
			{#if product.pricePerAlcoholUnit}
				<div class="stat py-3">
					<div class="stat-title text-xs">Pris per alkenhet</div>
					<div class="stat-value text-accent text-xl sm:text-2xl">
						{product.pricePerAlcoholUnit.toFixed(2)} kr
					</div>
					<div class="stat-desc text-xs">{product.alcoholUnits?.toFixed(1)} enheter</div>
				</div>
			{/if}
			{#if product.valueScore && valueScoreInfo}
				<div class="stat py-3">
					<div class="stat-title text-xs">Verdi for pengene</div>
					<div class="w-full mt-2">
						<progress
							class="progress {valueScoreInfo.color === 'text-success'
								? 'progress-success'
								: valueScoreInfo.color === 'text-info'
									? 'progress-info'
									: valueScoreInfo.color === 'text-warning'
										? 'progress-warning'
										: 'progress-error'} h-3"
							value={Math.min(product.valueScore, 20)}
							max="20"
						></progress>
					</div>
					<div class="stat-desc flex items-center gap-1 text-xs mt-1">
						<span>{product.rating?.toFixed(1)}</span>
						<Star size={10} class="fill-current" />
						<span>• {product.pricePerLiter?.toFixed(0)} kr/L</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-3 {gridCols}">
		{#if product.strength}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">Styrke</h3>
					<p class="text-xl font-bold">{product.strength}%</p>
				</div>
			</div>
		{/if}
		{#if product.ibu}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">IBU</h3>
					<p class="text-xl font-bold">{product.ibu}</p>
				</div>
			</div>
		{/if}
		{#if product.volume}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">Størrelse</h3>
					<p class="text-xl font-bold">{product.volume} L</p>
				</div>
			</div>
		{/if}
		{#if product.alcoholUnits}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">Alkoholenheter</h3>
					<p class="text-xl font-bold">{product.alcoholUnits.toFixed(1)}</p>
				</div>
			</div>
		{/if}
		{#if product.sugar}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">Sukker</h3>
					<p class="text-xl font-bold">{product.sugar} g/L</p>
				</div>
			</div>
		{/if}
		{#if product.acid}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-3 pl-6">
					<h3 class="text-xs text-base-content/70 font-medium">Syre</h3>
					<p class="text-xl font-bold">{product.acid} g/L</p>
				</div>
			</div>
		{/if}
	</div>
</div>
