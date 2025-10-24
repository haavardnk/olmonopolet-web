export type Store = {
	name: string;
	stock: number;
};

export type Product = {
	id: string;
	name: string;
	image: string;
	price?: number | null;
	volume?: number | null;
	pricePerLiter?: number | null;
	style?: string | null;
	rating?: number | null;
	checkins?: number | null;
	strength?: number | null;
	ibu?: number | null;
	alcoholUnits?: number | null;
	freshness?: number | null;
	fullness?: number | null;
	bitterness?: number | null;
	sweetness?: number | null;
	description?: string | null;
	taste?: string | null;
	aroma?: string | null;
	color?: string | null;
	pairing?: string | null;
	ingredients?: string | null;
	method?: string | null;
	allergens?: string | null;
	brewery?: string | null;
	country?: string | null;
	assortment?: string | null;
	vmpUrl?: string | null;
	untappdUrl?: string | null;
	stores: Store[];
};

export type ProductStats = {
	productCount: number;
	beerCount: number;
	ciderCount: number;
	meadCount: number;
};

export type Release = {
	name: string;
	releaseDate: string;
	formattedDate: string;
	beerCount: number;
	assortments: string[];
	products: Product[];
	stats: ProductStats;
};
