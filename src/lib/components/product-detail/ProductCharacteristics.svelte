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
		<div class="card-body">
			<h3 class="card-title text-lg mb-4">Egenskaper</h3>

			{#if product.freshness != null}
				<div class="mb-4">
					<div class="flex justify-between mb-1">
						<span class="text-sm font-semibold">Friskhet</span>
						<span class="text-sm font-bold text-success">{product.freshness}%</span>
					</div>
					<progress class="progress progress-success" value={product.freshness} max="100"
					></progress>
				</div>
			{/if}

			{#if product.fullness != null}
				<div class="mb-4">
					<div class="flex justify-between mb-1">
						<span class="text-sm font-semibold">Fylde</span>
						<span class="text-sm font-bold text-primary">{product.fullness}%</span>
					</div>
					<progress class="progress progress-primary" value={product.fullness} max="100"></progress>
				</div>
			{/if}

			{#if product.bitterness != null}
				<div class="mb-4">
					<div class="flex justify-between mb-1">
						<span class="text-sm font-semibold">Bitterhet</span>
						<span class="text-sm font-bold text-warning">{product.bitterness}%</span>
					</div>
					<progress class="progress progress-warning" value={product.bitterness} max="100"
					></progress>
				</div>
			{/if}

			{#if product.sweetness != null}
				<div>
					<div class="flex justify-between mb-1">
						<span class="text-sm font-semibold">Sødme</span>
						<span class="text-sm font-bold text-secondary">{product.sweetness}%</span>
					</div>
					<progress class="progress progress-secondary" value={product.sweetness} max="100"
					></progress>
				</div>
			{/if}
		</div>
	</div>
{/if}
