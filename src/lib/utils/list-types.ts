import { List, ShoppingCart, Archive, CloudDownload } from '@lucide/svelte';
import type { ListType } from '$lib/types';
import type { Component } from 'svelte';

export type ListTypeConfig = {
	icon: Component;
	label: string;
	description: string;
};

export type ListFlags = {
	showQuantity: boolean;
	showStore: boolean;
	showVintage: boolean;
	showPrices: boolean;
};

export type ListPreset = {
	id: string;
	icon: Component;
	label: string;
	description: string;
	flags: ListFlags;
};

export const LIST_PRESETS: ListPreset[] = [
	{
		id: 'simple',
		icon: List,
		label: 'Enkel liste',
		description: 'Bare en liste med produkter',
		flags: { showQuantity: false, showStore: false, showVintage: false, showPrices: true }
	},
	{
		id: 'shopping',
		icon: ShoppingCart,
		label: 'Handleliste',
		description: 'Med antall, priser og butikkstatus',
		flags: { showQuantity: true, showStore: true, showVintage: false, showPrices: true }
	},
	{
		id: 'cellar',
		icon: Archive,
		label: 'Kjellerliste',
		description: 'Spor årgang og lager',
		flags: { showQuantity: true, showStore: false, showVintage: true, showPrices: true }
	}
];

export function matchPreset(flags: ListFlags): ListPreset | null {
	return (
		LIST_PRESETS.find(
			(p) =>
				p.flags.showQuantity === flags.showQuantity &&
				p.flags.showStore === flags.showStore &&
				p.flags.showVintage === flags.showVintage &&
				p.flags.showPrices === flags.showPrices
		) ?? null
	);
}

export const LIST_TYPE_CONFIG: Record<ListType, ListTypeConfig> = {
	standard: { icon: List, label: 'Standard', description: 'En enkel liste' },
	shopping: { icon: ShoppingCart, label: 'Handleliste', description: 'Med antall og priser' },
	cellar: { icon: Archive, label: 'Kjeller', description: 'Lageroversikt med årgang' },
	event: { icon: List, label: 'Arrangement', description: 'Meny uten priser' },
	untappd: { icon: CloudDownload, label: 'Untappd', description: 'Importert liste fra Untappd' }
};

export function getListTypeConfig(listType: ListType | null | undefined): ListTypeConfig {
	return LIST_TYPE_CONFIG[listType ?? 'standard'];
}

export function getListTypeLabel(listType: ListType | null | undefined): string {
	return getListTypeConfig(listType).label;
}
