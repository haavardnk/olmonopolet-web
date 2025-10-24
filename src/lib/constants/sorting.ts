export const SORT_OPTIONS = {
	'Alkohol (høy til lav)': '-abv',
	'Alkohol (lav til høy)': 'abv',
	'Bryggeri (A-Å)': 'brewery',
	'Bryggeri (Å-A)': '-brewery',
	'Nyeste først': '-created_at',
	'Eldste først': 'created_at',
	'Rating (høy til lav)': '-rating',
	'Rating (lav til høy)': 'rating',
	'Navn (A-Å)': 'vmp_name',
	'Navn (Å-A)': '-vmp_name',
	'Pris (høy til lav)': '-price',
	'Pris (lav til høy)': 'price',
	'Pris per liter (høy til lav)': '-price_per_volume',
	'Pris per liter (lav til høy)': 'price_per_volume'
} as const;

export const SORT_LABELS = Object.keys(SORT_OPTIONS) as Array<keyof typeof SORT_OPTIONS>;
export const SORT_VALUES = Object.values(SORT_OPTIONS);

export type SortLabel = keyof typeof SORT_OPTIONS;
export type SortValue = (typeof SORT_OPTIONS)[SortLabel];
