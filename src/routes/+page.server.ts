import { formatDate } from '$lib/utils';
import type { PageServerLoad } from './$types';

import { API_URL } from '$env/static/private';

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

		const releases = (data.results || []).map((release: any) => {
			return {
				...release,
				product_selections: (release.product_selections || []).map((ps: any) =>
					ps === 'Spesialutvalg' ? 'Spesialutvalget' : ps
				),
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
