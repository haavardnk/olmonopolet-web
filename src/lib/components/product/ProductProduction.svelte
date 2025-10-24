<script lang="ts">
	import type { Product } from '$lib/types';
	import { TriangleAlert } from '@lucide/svelte';

	let { product }: { product: Product } = $props();
</script>

<div class="space-y-6">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl mb-4">Produksjonsinformasjon</h2>

			<div class="list">
				{#if product.brewery}
					<div class="list-row">
						<span class="font-semibold">Bryggeri:</span>
						<span class="text-base-content/80">{product.brewery}</span>
					</div>
				{/if}
				{#if product.country}
					<div class="list-row">
						<span class="font-semibold">Land:</span>
						<span class="text-base-content/80">{product.country}</span>
					</div>
				{/if}
				{#if product.method}
					<div class="list-row">
						<span class="font-semibold">Metode:</span>
						<span class="text-base-content/80">{product.method}</span>
					</div>
				{/if}
				{#if product.ingredients}
					<div class="list-row">
						<span class="font-semibold">Råstoff:</span>
						<span class="text-base-content/80">{product.ingredients}</span>
					</div>
				{/if}
				{#if product.assortment}
					<div class="list-row">
						<span class="font-semibold">Utvalg:</span>
						<span class="badge badge-primary">{product.assortment}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if product.allergens}
		<div class="alert alert-warning">
			<TriangleAlert size={24} class="shrink-0" />
			<div class="flex flex-col gap-1">
				<div class="font-bold text-base">Allergen informasjon</div>
				<div class="text-sm leading-relaxed">
					Dette produktet inneholder: <span class="font-semibold">{product.allergens}</span>
				</div>
			</div>
		</div>
	{/if}
</div>
