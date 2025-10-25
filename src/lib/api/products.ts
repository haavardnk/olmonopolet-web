import { API_URL } from '$env/static/private';

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
}

export interface Store {
	store_id: number;
	name: string;
	gps_lat: number;
	gps_long: number;
}

export interface StoreListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Store[];
}

export interface Release {
	name: string;
	release_date: string;
	beer_count: number;
	product_selections: string;
}

export interface ReleaseListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Release[];
}

export interface ProductListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Array<{
		vmp_id: string;
		vmp_name: string;
		price: number;
		rating: number | null;
		checkins: number;
		label_sm_url: string;
		main_category: string;
		sub_category: string;
		style: string;
		stock: number;
		abv: number;
		volume: number;
		price_per_volume: number;
		vmp_url: string;
		untpd_url: string | null;
		untpd_id: string | null;
		country: string;
		product_selection: string;
	}>;
}

export async function fetchProducts(
	page: number = 1,
	pageSize: number = 20,
	filters: ProductFilters = {}
): Promise<ProductListResponse> {
	const fields = [
		'vmp_id',
		'vmp_name',
		'price',
		'rating',
		'checkins',
		'label_sm_url',
		'main_category',
		'sub_category',
		'style',
		'stock',
		'abv',
		'volume',
		'price_per_volume',
		'vmp_url',
		'untpd_url',
		'untpd_id',
		'country',
		'product_selection'
	].join(',');

	const params = new URLSearchParams({
		fields,
		active: 'True',
		page: page.toString(),
		page_size: pageSize.toString()
	});

	if (filters.priceFrom) params.append('price_low', filters.priceFrom);
	if (filters.priceTo) params.append('price_high', filters.priceTo);
	if (filters.pricePerLiterFrom) params.append('ppv_low', filters.pricePerLiterFrom);
	if (filters.pricePerLiterTo) params.append('ppv_high', filters.pricePerLiterTo);
	if (filters.abvFrom) params.append('abv_low', filters.abvFrom);
	if (filters.abvTo) params.append('abv_high', filters.abvTo);
	if (filters.style) params.append('style', filters.style);
	if (filters.country) params.append('country', filters.country);
	if (filters.productSelection) params.append('product_selection', filters.productSelection);
	if (filters.search) params.append('search', filters.search);
	if (filters.release) params.append('release', filters.release);

	if (filters.allergens) {
		params.append('exclude_allergen', filters.allergens);
	}

	if (filters.sortBy) params.append('ordering', filters.sortBy);
	if (filters.store) params.append('store', filters.store);

	if (filters.deliveryOptions) {
		const deliveryOpts = filters.deliveryOptions.split(',');
		if (deliveryOpts.includes('Levering til butikk')) {
			params.append('store_delivery', 'True');
		}
		if (deliveryOpts.includes('Levering på posten')) {
			params.append('post_delivery', 'True');
		}
	}

	const url = `${API_URL}/beers/?${params.toString()}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchStores(): Promise<StoreListResponse> {
	const fields = ['store_id', 'name', 'gps_lat', 'gps_long'].join(',');

	const params = new URLSearchParams({
		fields,
		page_size: '500'
	});

	const url = `${API_URL}/stores/?${params.toString()}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchReleases(): Promise<ReleaseListResponse> {
	const fields = ['name', 'release_date', 'beer_count', 'product_selections'].join(',');

	const params = new URLSearchParams({
		fields
	});

	const url = `${API_URL}/release/?${params.toString()}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchStyles(): Promise<string[]> {
	const url = `${API_URL}/beers/styles/`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch styles: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
