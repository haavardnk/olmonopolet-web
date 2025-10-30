import { fetchProducts, type ProductFilters } from '$lib/api/products';
import type { Product } from '$lib/types';
import { getAssortmentDisplayName } from '$lib/utils/helpers';

export const load = async ({ url }: { url: URL }) => {
	const searchParams = new URLSearchParams(url.searchParams);
	const search = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort') || '-rating';
	const store = searchParams.get('store') || '';
	const priceFrom = searchParams.get('priceFrom') || '';
	const priceTo = searchParams.get('priceTo') || '';
	const pricePerLiterFrom = searchParams.get('pricePerLiterFrom') || '';
	const pricePerLiterTo = searchParams.get('pricePerLiterTo') || '';
	const style = searchParams.get('style') || '';
	const country = searchParams.get('country') || '';
	const abvFrom = searchParams.get('abvFrom') || '';
	const abvTo = searchParams.get('abvTo') || '';
	const allergens = searchParams.get('allergens') || '';
	const productSelection = searchParams.get('productSelection') || '';
	const deliveryOptions = searchParams.get('deliveryOptions') || '';
	const release = searchParams.get('release') || '';
	const isChristmasBeer = searchParams.get('is_christmas_beer') || '';
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
		style,
		country,
		abvFrom,
		abvTo,
		allergens,
		productSelection,
		deliveryOptions,
		release,
		isChristmasBeer
	};

	try {
		const response = await fetchProducts(page, pageSize, filters);

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
