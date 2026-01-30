import { fetchProducts, type ProductFilters } from '$lib/api/products';
import type { Product } from '$lib/types';
import { getAssortmentDisplayName } from '$lib/utils/helpers';

export const load = async ({ url, cookies }: { url: URL; cookies: any }) => {
	const searchParams = new URLSearchParams(url.searchParams);
	const search = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort') || '-rating';
	const store = searchParams.get('store') || '';
	const priceFrom = searchParams.get('priceFrom') || '';
	const priceTo = searchParams.get('priceTo') || '';
	const pricePerLiterFrom = searchParams.get('pricePerLiterFrom') || '';
	const pricePerLiterTo = searchParams.get('pricePerLiterTo') || '';
	const main_category = searchParams.get('main_category') || '';
	const style = searchParams.get('style') || '';
	const country = searchParams.get('country') || '';
	const abvFrom = searchParams.get('abvFrom') || '';
	const abvTo = searchParams.get('abvTo') || '';
	const allergens = searchParams.get('allergens') || '';
	const productSelection = searchParams.get('productSelection') || '';
	const deliveryOptions = searchParams.get('deliveryOptions') || '';
	const release = searchParams.get('release') || '';
	const isChristmasBeer = searchParams.get('is_christmas_beer') || '';
	const user_tasted = searchParams.get('user_tasted') || '';
	const page = parseInt(searchParams.get('page') || '1');
	const pageSize = 24;

	const filters: ProductFilters = {
		search,
		sortBy,
		store,
		priceFrom,
		priceTo,
		pricePerLiterFrom,
		pricePerLiterTo,
		main_category,
		style,
		country,
		abvFrom,
		abvTo,
		allergens,
		productSelection,
		deliveryOptions,
		release,
		isChristmasBeer,
		user_tasted
	};

	try {
		const sessionCookie = cookies.get('session');
		const cookieHeader = sessionCookie ? `session=${sessionCookie}` : undefined;
		const response = await fetchProducts(page, pageSize, filters, cookieHeader);

		const products: Product[] = response.results.map((item) => ({
			id: item.vmp_id,
			name: item.vmp_name,
			image: item.label_sm_url,
			price: item.price,
			volume: item.volume,
			pricePerLiter: item.price_per_volume,
			style: item.style,
			rating: item.rating,
			checkins: item.checkins,
			strength: item.abv,
			country: item.country,
			countryCode: item.country_code,
			assortment: getAssortmentDisplayName(item.product_selection),
			isChristmasBeer: item.is_christmas_beer,
			vmpUrl: item.vmp_url,
			untappdUrl: item.untpd_url,
			userTasted: (item as any).user_tasted,
			stores: []
		}));

		return {
			products,
			total: response.count,
			page,
			pageSize,
			hasMore: products.length === pageSize && response.count > page * pageSize,
			searchParams
		};
	} catch (error) {
		console.error('Error loading products:', error);
		return {
			products: [],
			total: 0,
			page: 1,
			pageSize,
			hasMore: false,
			error: 'Kunne ikke laste produkter',
			searchParams
		};
	}
};
