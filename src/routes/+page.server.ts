import { formatDate } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const page = Number(url.searchParams.get('page')) || 1;
		const page_size = 5;
		const apiUrl = `https://api.beermonopoly.com/release/?fields=name,release_date,beer_count,product_selections,product_stats&page_size=${page_size}&page=${page}`;
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`API returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();

		const releases = (data.results || []).map((release: any) => {
			return {
				...release,
				formatted_date: formatDate(release.release_date)
			};
		});

		return {
			releases,
			page,
			total: data.count || 0,
			page_size
		};
	} catch (error: any) {
		console.error('Error fetching releases:', error);

		return {
			releases: [],
			error: {
				message: error.message,
				status: error.status || 500
			}
		};
	}
};
