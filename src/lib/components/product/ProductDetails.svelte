<script lang="ts">
	import type { Product } from '$lib/types';

	let { product }: { product: Product } = $props();

	const hasDetails = $derived(
		product.description || product.taste || product.aroma || product.color || product.pairing
	);
</script>

{#if hasDetails}
	<div class="space-y-6">
		{#if product.description}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl">Beskrivelse</h2>
					<p class="text-base-content/80">{product.description}</p>
				</div>
			</div>
		{/if}

		{#if product.taste}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Smak</h2>
					<p class="text-base-content/80">{product.taste}</p>
				</div>
			</div>
		{/if}

		{#if product.aroma}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Lukt</h2>
					<p class="text-base-content/80">{product.aroma}</p>
				</div>
			</div>
		{/if}

		{#if product.color}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Farge</h2>
					<p class="text-base-content/80">{product.color}</p>
				</div>
			</div>
		{/if}

		{#if product.pairing}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Passer til</h2>
					<p class="text-base-content/80">{product.pairing}</p>
				</div>
			</div>
		{/if}
	</div>
{/if}
