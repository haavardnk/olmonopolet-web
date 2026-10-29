import type { PageServerLoad } from './$types';
import { fetchProductList } from '$lib/api/products';
import { LONG_CACHE_HEADERS, NO_CACHE_HEADERS } from '$lib/server/cache';

export const load: PageServerLoad = async ({ fetch, setHeaders, cookies }) => {
	const sessionCookie = cookies.get('session');
	setHeaders(sessionCookie ? NO_CACHE_HEADERS : LONG_CACHE_HEADERS);

	const [year, month] = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Oslo',
		year: 'numeric',
		month: 'numeric'
	})
		.format(new Date())
		.split('-')
		.map(Number);

	const products = await fetchProductList(
		{ is_christmas_beer: 'True', active: 'True', ordering: '-rating' },
		fetch,
		sessionCookie
	);

	return {
		products,
		year: month >= 7 ? year : year - 1
	};
};
