<script lang="ts">
	import { ShoppingCart } from '@lucide/svelte';
	import { formatCurrency, getProductCountLabel } from '$lib/utils/formatters';

	type Props = {
		totalPrice: number;
		totalQuantity: number;
		storeName?: string | null;
	};

	let { totalPrice, totalQuantity, storeName = null }: Props = $props();
</script>

<div class="card bg-base-300 mt-4">
	<div class="card-body p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<ShoppingCart size={20} />
				<div>
					<span class="text-sm text-base-content/70">
						Totalt ({getProductCountLabel(totalQuantity)})
					</span>
					{#if storeName}
						<div class="text-xs text-base-content/50">{storeName}</div>
					{/if}
				</div>
			</div>
			<div class="text-right">
				<div class="text-lg font-bold">{formatCurrency(totalPrice)}</div>
				<div class="text-xs text-base-content/60">totalt</div>
			</div>
		</div>
	</div>
</div>
