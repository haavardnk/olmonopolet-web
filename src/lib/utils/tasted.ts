import { markAsTasted, unmarkAsTasted } from '$lib/api/tasted';
import { tastedStore } from '$lib/stores/tasted.svelte';
import type { Product } from '$lib/types';

export async function toggleTastedStatus(
	productId: string,
	currentState: boolean,
	onSuccess?: (newState: boolean) => void
): Promise<boolean> {
	try {
		const response = currentState ? await unmarkAsTasted(productId) : await markAsTasted(productId);

		if (response.ok) {
			const newState = !currentState;
			tastedStore.setTasted(productId, newState);
			onSuccess?.(newState);
			return true;
		} else {
			console.error('Failed to update tasted status:', response.statusText);
			return false;
		}
	} catch (error) {
		console.error('Error updating tasted status:', error);
		return false;
	}
}

export function updateProductTasted(
	products: Product[],
	productId: string,
	newState: boolean
): Product[] {
	return products.map((p) => (p.id === productId ? { ...p, userTasted: newState } : p));
}
