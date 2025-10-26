import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { Release } from '$lib/types';
import { formatDate, getAssortmentDisplayName } from '$lib/utils/helpers';

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const page_size = 5;
		const apiUrl = `${API_URL}/release/?fields=name,release_date,beer_count,product_selections,product_stats&page_size=${page_size}&page=${page}`;
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`API returnerte ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		const releases: Release[] = (data.results || []).map((release: any) => {
			return {
				name: release.name,
				releaseDate: release.release_date,
				formattedDate: formatDate(release.release_date),
				beerCount: release.beer_count,
				assortments: (release.product_selections || [])
					.map((ps: string) => getAssortmentDisplayName(ps))
					.filter((name: string | null): name is string => name !== null),
				stats: {
					productCount: release.product_stats.product_count,
					beerCount: release.product_stats.beer_count,
					ciderCount: release.product_stats.cider_count,
					meadCount: release.product_stats.mead_count
				},
				products: []
			};
		});

		return {
			releases,
			page,
			total: data.count || 0,
			page_size
		};
	} catch (error: any) {
		console.error('Feil ved henting av lanseringer:', error);

		return {
			releases: [],
			error: {
				message: error.message,
				status: error.status || 500
			}
		};
	}
};
