export type UserLocation = {
	lat: number;
	lng: number;
};

export type Store = {
	name: string;
	stock: number;
	lat?: number;
	lng?: number;
};

export type Product = {
	id: string;
	name: string;
	image: string;
	price?: number | null;
	volume?: number | null;
	pricePerLiter?: number | null;
	style?: string | null;
	isChristmasBeer?: boolean;
	rating?: number | null;
	checkins?: number | null;
	strength?: number | null;
	ibu?: number | null;
	alcoholUnits?: number | null;
	freshness?: number | null;
	fullness?: number | null;
	bitterness?: number | null;
	sweetness?: number | null;
	sugar?: number | null;
	acid?: number | null;
	year?: number | null;
	storable?: string | null;
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
	countryCode?: string | null;
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
	isChristmasRelease: boolean;
	products?: Product[];
	stats: ProductStats;
};

export interface ProductFilters {
	store?: string;
	priceFrom?: string;
	priceTo?: string;
	pricePerLiterFrom?: string;
	pricePerLiterTo?: string;
	style?: string;
	country?: string;
	abvFrom?: string;
	abvTo?: string;
	allergens?: string;
	productSelection?: string;
	deliveryOptions?: string;
	release?: string;
	search?: string;
	sortBy?: string;
	isChristmasBeer?: string;
}

export interface ApiStore {
	store_id: number;
	name: string;
	lat: number;
	lng: number;
}

export interface ApiStoreResponse {
	store_id: number;
	name: string;
	gps_lat: number;
	gps_long: number;
}

export interface StoreListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: ApiStoreResponse[];
}

export interface ApiRelease {
	name: string;
	release_date: string;
	beer_count: number;
	product_selections: string[];
	is_christmas_release: boolean;
	product_stats: {
		product_count: number;
		beer_count: number;
		cider_count: number;
		mead_count: number;
	};
}

export interface ReleaseListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: ApiRelease[];
}

export interface ApiProduct {
	vmp_id: string;
	vmp_name: string;
	price: number;
	rating: number | null;
	checkins: number;
	label_sm_url: string;
	label_hd_url?: string;
	main_category?: string;
	sub_category?: string;
	style?: string;
	is_christmas_beer?: boolean;
	stock?: number;
	abv: number;
	ibu?: number;
	alcohol_units?: number;
	volume: number;
	price_per_volume: number;
	vmp_url: string;
	untpd_url: string | null;
	untpd_id: string | null;
	country?: string;
	country_code?: string | null;
	product_selection?: string;
	freshness?: number;
	fullness?: number;
	bitterness?: number;
	sweetness?: number;
	sugar?: number;
	acid?: number;
	year?: number;
	storable?: string;
	description?: string;
	taste?: string;
	aroma?: string;
	color?: string;
	food_pairing?: string;
	raw_materials?: string;
	method?: string;
	allergens?: string;
	brewery?: string;
	all_stock?: Array<{
		store_name: string;
		quantity: number;
		gps_lat?: number;
		gps_long?: number;
	}>;
}

export interface ProductListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: ApiProduct[];
}

export interface Country {
	name: string;
	iso_code: string;
}

export enum SortField {
	ABV = 'abv',
	Brewery = 'brewery',
	CreatedAt = 'created_at',
	Rating = 'rating',
	Name = 'vmp_name',
	Price = 'price',
	PricePerVolume = 'price_per_volume'
}

export type FilterItem<T extends string | number = string> = {
	value: T;
	label: string;
	meta?: string;
};
