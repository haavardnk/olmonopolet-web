import { List, ShoppingCart, Archive, Calendar } from '@lucide/svelte';
import type { ListType } from '$lib/types';
import type { Component } from 'svelte';

export type ListTypeConfig = {
	icon: Component;
	label: string;
	description: string;
};

export const LIST_TYPE_CONFIG: Record<ListType, ListTypeConfig> = {
	standard: { icon: List, label: 'Standard', description: 'En enkel liste' },
	shopping: { icon: ShoppingCart, label: 'Handleliste', description: 'Med antall og priser' },
	cellar: { icon: Archive, label: 'Kjeller', description: 'Lageroversikt med årgang' },
	event: { icon: Calendar, label: 'Arrangement', description: 'Meny uten priser' }
};

export function getListTypeConfig(listType: ListType | null | undefined): ListTypeConfig {
	return LIST_TYPE_CONFIG[listType ?? 'standard'];
}

export function getListTypeLabel(listType: ListType | null | undefined): string {
	return getListTypeConfig(listType).label;
}

export function isTypedList(listType: ListType | null | undefined): boolean {
	return !!listType && listType !== 'standard';
}

export function getListTypesArray(): Array<{ value: ListType } & ListTypeConfig> {
	return (Object.entries(LIST_TYPE_CONFIG) as [ListType, ListTypeConfig][]).map(
		([value, config]) => ({
			value,
			...config
		})
	);
}
