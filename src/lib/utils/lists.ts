import type { UserList, ApiUserList, ListType } from '$lib/types';
import { listsStore } from '$lib/stores/lists.svelte';

const MENU_WIDTH = 224;

export function transformApiList(data: ApiUserList | Record<string, unknown>): UserList {
	const apiData = data as ApiUserList;

	let productIds: string[];
	if (apiData.product_ids && apiData.product_ids.length > 0) {
		productIds = apiData.product_ids.map((id) => String(id));
	} else if (apiData.items) {
		productIds = apiData.items.map((item) => String(item.product_id));
	} else {
		productIds = [];
	}

	return {
		id: String(apiData.id),
		name: apiData.name as string,
		description: (apiData.description as string) || null,
		listType: (apiData.list_type as ListType) || 'standard',
		selectedStoreId: apiData.selected_store_id ?? null,
		eventDate: apiData.event_date ?? null,
		itemCount: apiData.item_count ?? 0,
		isPast: apiData.is_past,
		totalPrice: apiData.total_price,
		stats: apiData.stats
			? {
					totalBottles: apiData.stats.total_bottles,
					totalValue: apiData.stats.total_value,
					oldestYear: apiData.stats.oldest_year,
					newestYear: apiData.stats.newest_year
				}
			: undefined,
		productIds,
		sortOrder: (apiData.sort_order as number) ?? 0,
		shareToken: apiData.share_token as string,
		createdAt: apiData.created_at as string,
		updatedAt: apiData.updated_at as string
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

export async function addProductToList(listId: string, productId: string): Promise<boolean> {
	try {
		const response = await fetch(`/api/lists/${listId}/items`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ product_id: productId })
		});
		if (response.ok || response.status === 201) {
			listsStore.addProductToList(listId, productId);
			return true;
		}
	} catch {}
	return false;
}

export async function removeProductFromList(listId: string, productId: string): Promise<boolean> {
	try {
		const listResponse = await fetch(`/api/lists/${listId}`);
		if (!listResponse.ok) return false;

		const listData = await listResponse.json();
		const items = listData.items || [];
		const item = items.find(
			(i: { product_id: number | string }) => String(i.product_id) === String(productId)
		);

		if (!item) return false;

		const response = await fetch(`/api/lists/${listId}/items/${item.id}`, {
			method: 'DELETE'
		});
		if (response.ok || response.status === 204) {
			listsStore.removeProductFromList(listId, productId);
			return true;
		}
	} catch {}
	return false;
}

export async function toggleProductInList(
	listId: string,
	productId: string,
	isInList: boolean
): Promise<boolean> {
	if (isInList) {
		return removeProductFromList(listId, productId);
	} else {
		return addProductToList(listId, productId);
	}
}

export function isProductInList(list: UserList, productId: string | number): boolean {
	const pid = String(productId);
	return (list.productIds || []).map(String).includes(pid);
}

export function getListCountForProduct(lists: UserList[], productId: string | number): number {
	const pid = String(productId);
	return lists.filter((list) => isProductInList(list, pid)).length;
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
