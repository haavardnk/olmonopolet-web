export const SORT_FIELDS = {
	abv: 'Alkohol',
	brewery: 'Bryggeri',
	created_at: 'Dato',
	rating: 'Rating',
	vmp_name: 'Navn',
	price: 'Pris',
	price_per_volume: 'Pris per liter'
} as const;

export const SORT_FIELD_LABELS = Object.entries(SORT_FIELDS).map(([value, label]) => ({
	value,
	label
}));

export type SortField = keyof typeof SORT_FIELDS;
