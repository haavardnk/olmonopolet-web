<script lang="ts">
	import type { Product } from '$lib/types';

	let { product }: { product: Product } = $props();

	const hasDescription = $derived(product.description);
	const hasSensory = $derived(product.taste || product.aroma || product.color || product.pairing);
	const hasDetails = $derived(hasDescription || hasSensory);
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

		{#if hasSensory}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-2xl mb-4">Smaksprofil</h2>
					<div class="list">
						{#if product.taste}
							<div class="list-row">
								<span class="font-semibold">Smak:</span>
								<span class="text-base-content/80">{product.taste}</span>
							</div>
						{/if}

						{#if product.aroma}
							<div class="list-row">
								<span class="font-semibold">Lukt:</span>
								<span class="text-base-content/80">{product.aroma}</span>
							</div>
						{/if}

						{#if product.color}
							<div class="list-row">
								<span class="font-semibold">Farge:</span>
								<span class="text-base-content/80">{product.color}</span>
							</div>
						{/if}

						{#if product.pairing}
							<div class="list-row">
								<span class="font-semibold">Passer til:</span>
								<span class="text-base-content/80">{product.pairing}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
