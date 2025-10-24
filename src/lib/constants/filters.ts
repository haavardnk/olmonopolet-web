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

export type ProductSelection = (typeof PRODUCT_SELECTIONS)[number];
export type Allergen = (typeof ALLERGENS)[number];
export type DeliveryOption = (typeof DELIVERY_OPTIONS)[number];
