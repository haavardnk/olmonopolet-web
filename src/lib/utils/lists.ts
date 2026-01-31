import type { UserList, ApiUserList } from '$lib/types';
import { listsStore } from '$lib/stores/lists.svelte';

const MENU_WIDTH = 224;

export function transformApiList(data: ApiUserList | Record<string, unknown>): UserList {
	return {
		id: String(data.id),
		name: data.name as string,
		description: (data.description as string) || null,
		productIds: ((data.product_ids as string[]) || []).map(String),
		sortOrder: (data.sort_order as number) ?? 0,
		shareToken: data.share_token as string,
		createdAt: data.created_at as string,
		updatedAt: data.updated_at as string
	};
}

export async function fetchAndSetLists(forceRefresh = false): Promise<void> {
	if (!forceRefresh && (listsStore.isLoaded || listsStore.isLoading)) return;
	listsStore.setLoading(true);
	try {
		const response = await fetch('/api/lists');
		if (!response.ok) return;
		const data = await response.json();
		const results = data.results || data || [];
		listsStore.setLists(results.map(transformApiList));
	} catch {
	} finally {
		listsStore.setLoading(false);
	}
}

export async function toggleProductInList(
	listId: string,
	productId: string,
	isInList: boolean
): Promise<boolean> {
	try {
		const response = await fetch(`/api/lists/${listId}/products/${productId}`, {
			method: isInList ? 'DELETE' : 'POST'
		});
		if (response.ok || response.status === 204) {
			if (isInList) {
				listsStore.removeProductFromList(listId, productId);
			} else {
				listsStore.addProductToList(listId, productId);
			}
			return true;
		}
	} catch {}
	return false;
}

export function isProductInList(list: UserList, productId: string | number): boolean {
	return (list.productIds || []).map(String).includes(String(productId));
}

export function getListCountForProduct(lists: UserList[], productId: string | number): number {
	const pid = String(productId);
	return lists.filter((list) => (list.productIds || []).map(String).includes(pid)).length;
}

export function positionMenuFromButton(buttonEl: HTMLButtonElement | null): {
	top: number;
	left: number;
} {
	if (!buttonEl) return { top: 0, left: 0 };
	const rect = buttonEl.getBoundingClientRect();
	let left = rect.right - MENU_WIDTH;
	if (left < 8) left = 8;
	return { top: rect.bottom + 4, left };
}
