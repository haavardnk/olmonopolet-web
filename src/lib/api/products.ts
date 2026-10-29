import { error } from '@sveltejs/kit';
import { apiFetch } from '$lib/server/apiFetch';
import { getAssortmentDisplayName } from '$lib/utils/helpers';
import type {
	ApiProduct,
	Product,
	ProductFilters,
	ProductListResponse,
	StoreListResponse,
	ReleaseListResponse,
	Country
} from '$lib/types';

export type { ProductFilters };

const LIST_PRODUCT_FIELDS =
	'vmp_id,vmp_name,price,rating,checkins,label_sm_url,main_category,sub_category,style,is_christmas_beer,stock,abv,user_checked_in,user_wishlisted,user_tasted,volume,price_per_volume,vmp_url,untpd_url,untpd_id,country,country_code,product_selection';

export async function fetchProductList(
	query: Record<string, string>,
	fetchFn: typeof fetch,
	sessionCookie?: string
): Promise<Product[]> {
	const params = new URLSearchParams({ ...query, fields: LIST_PRODUCT_FIELDS, page_size: '1000' });
	const headers: Record<string, string> = sessionCookie
		? { Cookie: `session=${sessionCookie}` }
		: {};
	const res = await apiFetch(`/beers/?${params}`, { headers }, fetchFn);
	if (!res.ok) {
		throw error(res.status, { message: `API returnerte ${res.status}: ${res.statusText}` });
	}
	const data: ProductListResponse = await res.json();
	return (data.results || []).map((p: ApiProduct) => ({
		id: p.vmp_id,
		name: p.vmp_name,
		image: p.label_sm_url,
		price: p.price,
		volume: p.volume,
		pricePerLiter: p.price_per_volume,
		style: p.style || p.sub_category || p.main_category,
		isChristmasBeer: p.is_christmas_beer,
		rating: p.rating,
		checkins: p.checkins,
		strength: p.abv,
		ibu: p.ibu,
		alcoholUnits: p.alcohol_units,
		country: p.country,
		countryCode: p.country_code,
		assortment: getAssortmentDisplayName(p.product_selection),
		vmpUrl: p.vmp_url,
		untappdUrl: p.untpd_url,
		userTasted: p.user_tasted,
		stores: []
	}));
}

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
		'value_score',
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
	if (filters.packageType) params.append('package_type', filters.packageType);
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

	const url = `/beers/?${params.toString()}`;

	const headers: HeadersInit = {};
	if (cookies) {
		headers['Cookie'] = cookies;
	}

	const response = await apiFetch(url, { headers });

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

	const url = `/stores/?${params.toString()}`;

	const response = await apiFetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchReleases(): Promise<ReleaseListResponse> {
	const fields = ['name', 'release_date', 'product_selections'].join(',');

	const params = new URLSearchParams({
		fields
	});

	const url = `/release/?${params.toString()}`;

	const response = await apiFetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchStyles(): Promise<string[]> {
	const url = `/beers/styles/`;

	const response = await apiFetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch styles: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export async function fetchCountries(): Promise<Country[]> {
	const url = `/countries/active/`;

	const response = await apiFetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
