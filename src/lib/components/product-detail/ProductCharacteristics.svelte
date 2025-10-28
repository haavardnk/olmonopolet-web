<script lang="ts">
	import type { Product } from '$lib/types';

	let { product }: { product: Product } = $props();

	const hasCharacteristics = $derived(
		product.freshness != null ||
			product.fullness != null ||
			product.bitterness != null ||
			product.sweetness != null
	);
</script>

{#if hasCharacteristics}
	<div class="card bg-base-100 shadow">
		<div class="card-body p-3 sm:p-4">
			<h3 class="card-title text-sm sm:text-base mb-2">Egenskaper</h3>

			{#if product.freshness != null}
				<div class="mb-2">
					<div class="flex justify-between mb-0.5">
						<span class="text-xs font-medium">Friskhet</span>
						<span class="text-xs font-bold text-success">{product.freshness}%</span>
					</div>
					<progress class="progress progress-success h-1.5" value={product.freshness} max="100"
					></progress>
				</div>
			{/if}

			{#if product.fullness != null}
				<div class="mb-2">
					<div class="flex justify-between mb-0.5">
						<span class="text-xs font-medium">Fylde</span>
						<span class="text-xs font-bold text-primary">{product.fullness}%</span>
					</div>
					<progress class="progress progress-primary h-1.5" value={product.fullness} max="100"
					></progress>
				</div>
			{/if}

			{#if product.bitterness != null}
				<div class="mb-2">
					<div class="flex justify-between mb-0.5">
						<span class="text-xs font-medium">Bitterhet</span>
						<span class="text-xs font-bold text-warning">{product.bitterness}%</span>
					</div>
					<progress class="progress progress-warning h-1.5" value={product.bitterness} max="100"
					></progress>
				</div>
			{/if}

			{#if product.sweetness != null}
				<div>
					<div class="flex justify-between mb-0.5">
						<span class="text-xs font-medium">Sødme</span>
						<span class="text-xs font-bold text-secondary">{product.sweetness}%</span>
					</div>
					<progress class="progress progress-secondary h-1.5" value={product.sweetness} max="100"
					></progress>
				</div>
			{/if}
		</div>
	</div>
{/if}
