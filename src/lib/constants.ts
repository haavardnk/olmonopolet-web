import { SortField } from './types';

export const SORT_FIELD_LABELS: { value: SortField; label: string }[] = [
	{ value: SortField.Rating, label: 'Rating' },
	{ value: SortField.CreatedAt, label: 'Dato' },
	{ value: SortField.Price, label: 'Pris' },
	{ value: SortField.PricePerVolume, label: 'Pris per liter' },
	{ value: SortField.ABV, label: 'Alkohol' },
	{ value: SortField.Name, label: 'Navn' },
	{ value: SortField.Brewery, label: 'Bryggeri' }
];

export const PRODUCT_SELECTIONS = [
	{ label: 'Basisutvalget', value: 'basisutvalget' },
	{ label: 'Bestillingsutvalget', value: 'bestillingsutvalget' },
	{ label: 'Partiutvalget', value: 'partiutvalget' },
	{ label: 'Spesialutvalget', value: 'spesialutvalg' },
	{ label: 'Tilleggsutvalget', value: 'tilleggsutvalget' }
] as const;

export const ALLERGENS = [
	{ label: 'Gluten', value: 'gluten, bygg, spelt, hvete, havre, rug' },
	{ label: 'Laktose', value: 'laktose, melk' },
	{ label: 'Nøtter', value: 'nøtter, peanøtt, hasselnøtt, valnøtt, nøtt' },
	{ label: 'Sulfitt', value: 'sulfitt' }
] as const;

export const DELIVERY_OPTIONS = ['Levering til butikk', 'Levering på posten'] as const;
