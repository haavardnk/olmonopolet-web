import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { apiFetch } from '$lib/server/apiFetch';
import { fetchProductList } from '$lib/api/products';
import type { ProductStats, ApiRelease } from '$lib/types';
import { formatDate, slugify, unslugify, getAssortmentDisplayName } from '$lib/utils/helpers';
import { LONG_CACHE_HEADERS, NO_CACHE_HEADERS } from '$lib/server/cache';

export const load: PageServerLoad = async ({ params, fetch, setHeaders, cookies }) => {
	const sessionCookie = cookies.get('session');

	setHeaders(sessionCookie ? NO_CACHE_HEADERS : LONG_CACHE_HEADERS);

	const name = unslugify(params.id);
	try {
		const releaseInfoUrl = `/release/${encodeURIComponent(name)}/?fields=name,release_date,product_selections,product_stats,is_christmas_release`;
		const releaseInfoRes = await apiFetch(releaseInfoUrl, {}, fetch);
		if (!releaseInfoRes.ok) {
			if (releaseInfoRes.status === 404) {
				throw error(404, { message: 'Lansering ikke funnet' });
			}
			throw error(releaseInfoRes.status, {
				message: `API returnerte ${releaseInfoRes.status}: ${releaseInfoRes.statusText}`
			});
		}
		const releaseInfo: ApiRelease = await releaseInfoRes.json();

		const stats: ProductStats = {
			productCount: releaseInfo.product_stats.product_count,
			beerCount: releaseInfo.product_stats.beer_count,
			ciderCount: releaseInfo.product_stats.cider_count,
			meadCount: releaseInfo.product_stats.mead_count,
			christmasBeerCount: releaseInfo.product_stats.christmas_beer_count ?? 0
		};

		const release = {
			name: releaseInfo.name,
			releaseDate: releaseInfo.release_date,
			formattedDate: formatDate(releaseInfo.release_date),
			assortments: (releaseInfo.product_selections || [])
				.map((ps: string) => getAssortmentDisplayName(ps))
				.filter((name: string | null): name is string => name !== null),
			isChristmasRelease: releaseInfo.is_christmas_release,
			stats
		};

		const productsPromise = fetchProductList(
			{ release: name, ordering: '-rating' },
			fetch,
			sessionCookie
		);

		return {
			release,
			slug: slugify(releaseInfo.name),
			products: productsPromise
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, { message: 'Serverfeil' });
	}
};
