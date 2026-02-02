import { API_URL } from '$env/static/private';
import type {
	ProductFilters,
	ProductListResponse,
	StoreListResponse,
	ReleaseListResponse,
	Country
} from '$lib/types';

export type { ProductFilters };

export async function fetchProducts(
	page: number = 1,
	pageSize: number = 20,
	filters: ProductFilters = {},
	cookies?: string
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
		'is_christmas_beer',
		'stock',
		'abv',
		'volume',
		'price_per_volume',
		'vmp_url',
		'untpd_url',
		'untpd_id',
		'country',
		'country_code',
		'product_selection',
		'user_tasted'
	].join(',');

	const params = new URLSearchParams({
		fields,
		page: page.toString(),
		page_size: pageSize.toString()
	});

	if (!filters.ids) {
		params.append('active', 'True');
	}

	if (filters.priceFrom) params.append('price_low', filters.priceFrom);
	if (filters.priceTo) params.append('price_high', filters.priceTo);
	if (filters.pricePerLiterFrom) params.append('ppv_low', filters.pricePerLiterFrom);
	if (filters.pricePerLiterTo) params.append('ppv_high', filters.pricePerLiterTo);
	if (filters.abvFrom) params.append('abv_low', filters.abvFrom);
	if (filters.abvTo) params.append('abv_high', filters.abvTo);
	if (filters.main_category) params.append('main_category', filters.main_category);
	if (filters.style) params.append('style', filters.style);
	if (filters.country) params.append('country', filters.country);
	if (filters.productSelection) params.append('product_selection', filters.productSelection);
	if (filters.search) params.append('search', filters.search);
	if (filters.release) params.append('release', filters.release);
	if (filters.isChristmasBeer) params.append('is_christmas_beer', filters.isChristmasBeer);

	if (filters.allergens) {
		params.append('exclude_allergen', filters.allergens);
	}

	if (filters.user_tasted === 'true') {
		params.append('user_tasted', 'True');
	} else if (filters.user_tasted === 'false') {
		params.append('user_tasted', 'false');
	}

	if (filters.sortBy) params.append('ordering', filters.sortBy);
	if (filters.store) params.append('store', filters.store);
	if (filters.checkStore) params.append('check_store', filters.checkStore);
	if (filters.ids) params.append('beers', filters.ids);

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

	const headers: HeadersInit = {};
	if (cookies) {
		headers['Cookie'] = cookies;
	}

	const response = await fetch(url, { headers });

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

export async function fetchCountries(): Promise<Country[]> {
	const url = `${API_URL}/countries/active/`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
