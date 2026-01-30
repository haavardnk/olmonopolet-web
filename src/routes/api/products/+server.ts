import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchProducts, type ProductFilters } from '$lib/api/products';
import { getAssortmentDisplayName } from '$lib/utils/helpers';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const sortBy = url.searchParams.get('sort') || '-rating';
	const store = url.searchParams.get('store') || '';
	const priceFrom = url.searchParams.get('priceFrom') || '';
	const priceTo = url.searchParams.get('priceTo') || '';
	const pricePerLiterFrom = url.searchParams.get('pricePerLiterFrom') || '';
	const pricePerLiterTo = url.searchParams.get('pricePerLiterTo') || '';
	const main_category = url.searchParams.get('main_category') || '';
	const style = url.searchParams.get('style') || '';
	const country = url.searchParams.get('country') || '';
	const abvFrom = url.searchParams.get('abvFrom') || '';
	const abvTo = url.searchParams.get('abvTo') || '';
	const allergens = url.searchParams.get('allergens') || '';
	const productSelection = url.searchParams.get('productSelection') || '';
	const deliveryOptions = url.searchParams.get('deliveryOptions') || '';
	const release = url.searchParams.get('release') || '';
	const isChristmasBeer = url.searchParams.get('is_christmas_beer') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
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
		isChristmasBeer
	};

	try {
		const response = await fetchProducts(page, pageSize, filters);

		const products = response.results.map((item) => ({
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

		return json({
			products,
			total: response.count,
			page,
			pageSize,
			hasMore: products.length === pageSize && response.count > page * pageSize
		});
	} catch (error) {
		console.error('Error loading products:', error);
		return json(
			{
				products: [],
				total: 0,
				page: 1,
				pageSize,
				hasMore: false,
				error: 'Kunne ikke laste produkter'
			},
			{ status: 500 }
		);
	}
};
