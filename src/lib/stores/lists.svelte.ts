import type { UserList } from '$lib/types';

let userLists = $state<Map<string, UserList>>(new Map());
let isLoaded = $state(false);
let isLoading = $state(false);

export const listsStore = {
	get lists() {
		return userLists;
	},
	get isLoaded() {
		return isLoaded;
	},
	get isLoading() {
		return isLoading;
	},
	setLoading(loading: boolean) {
		isLoading = loading;
	},
	get sortedLists(): UserList[] {
		return Array.from(userLists.values()).sort((a, b) => a.sortOrder - b.sortOrder);
	},
	getList(id: string) {
		return userLists.get(id);
	},
	setLists(lists: UserList[]) {
		userLists = new Map(
			lists.map((list) => [list.id, { ...list, productIds: list.productIds || [] }])
		);
		isLoaded = true;
	},
	addList(list: UserList) {
		const safeList = { ...list, productIds: list.productIds || [] };
		userLists = new Map(userLists).set(safeList.id, safeList);
	},
	updateList(id: string, updates: Partial<UserList>) {
		const existing = userLists.get(id);
		if (existing) userLists = new Map(userLists).set(id, { ...existing, ...updates });
	},
	deleteList(id: string) {
		const newMap = new Map(userLists);
		newMap.delete(id);
		userLists = newMap;
	},
	addProductToList(listId: string, productId: string) {
		const list = userLists.get(listId);
		const currentProducts = list?.productIds || [];
		if (list && !currentProducts.includes(productId)) {
			userLists = new Map(userLists).set(listId, {
				...list,
				productIds: [...currentProducts, productId]
			});
		}
	},
	removeProductFromList(listId: string, productId: string) {
		const list = userLists.get(listId);
		if (list) {
			userLists = new Map(userLists).set(listId, {
				...list,
				productIds: (list.productIds || []).filter((id) => id !== productId)
			});
		}
	},
	reorderLists(orderedIds: string[]) {
		const newMap = new Map(userLists);
		orderedIds.forEach((id, index) => {
			const list = newMap.get(id);
			if (list) newMap.set(id, { ...list, sortOrder: index });
		});
		userLists = newMap;
	},
	reorderProducts(listId: string, productIds: string[]) {
		const list = userLists.get(listId);
		if (list) userLists = new Map(userLists).set(listId, { ...list, productIds });
	},
	isProductInList(listId: string, productId: string): boolean {
		return userLists.get(listId)?.productIds.includes(productId) || false;
	},
	getListsContainingProduct(productId: string): UserList[] {
		return Array.from(userLists.values()).filter((list) => list.productIds.includes(productId));
	},
	clear() {
		userLists = new Map();
		isLoaded = false;
		isLoading = false;
	}
};
