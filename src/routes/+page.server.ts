import { formatDate } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const apiUrl = `https://api.beermonopoly.com/release/?fields=name,release_date,beer_count,product_selections,product_stats`;
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
			releases
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
