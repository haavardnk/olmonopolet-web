import { List, ShoppingCart, Archive } from '@lucide/svelte';
import type { Component } from 'svelte';

export type ListFlags = {
	showQuantity: boolean;
	showStore: boolean;
	showVintage: boolean;
	showPrices: boolean;
	showNotes: boolean;
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
		flags: { showQuantity: false, showStore: false, showVintage: false, showPrices: true, showNotes: false }
	},
	{
		id: 'shopping',
		icon: ShoppingCart,
		label: 'Handleliste',
		description: 'Med antall, priser og butikkstatus',
		flags: { showQuantity: true, showStore: true, showVintage: false, showPrices: true, showNotes: true }
	},
	{
		id: 'cellar',
		icon: Archive,
		label: 'Kjellerliste',
		description: 'Spor årgang og lager',
		flags: { showQuantity: true, showStore: false, showVintage: true, showPrices: true, showNotes: true }
	}
];

export function matchPreset(flags: ListFlags): ListPreset | null {
	return (
		LIST_PRESETS.find(
			(p) =>
				p.flags.showQuantity === flags.showQuantity &&
				p.flags.showStore === flags.showStore &&
				p.flags.showVintage === flags.showVintage &&
				p.flags.showPrices === flags.showPrices &&
				p.flags.showNotes === flags.showNotes
		) ?? null
	);
}
