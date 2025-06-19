import { formatDate } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const releaseInfoUrl = `https://api.beermonopoly.com/release/${params.id}/?fields=name,release_date,beer_count,product_selections,product_stats`;
		const releaseInfoRes = await fetch(releaseInfoUrl);
		if (!releaseInfoRes.ok) {
			if (releaseInfoRes.status === 404) {
				throw error(404, { message: 'Lansering ikke funnet' });
			}
			throw error(releaseInfoRes.status, {
				message: `API returnerte ${releaseInfoRes.status}: ${releaseInfoRes.statusText}`
			});
		}
		const releaseInfo = await releaseInfoRes.json();

		const fields =
			'vmp_id,vmp_name,price,rating,checkins,label_sm_url,main_category,sub_category,style,stock,abv,user_checked_in,user_wishlisted,volume,price_per_volume,vmp_url,untpd_url,untpd_id,country,product_selection';
		const productsUrl = `https://api.beermonopoly.com/beers/?fields=${fields}&release=${params.id}&ordering=-rating&page_size=1000`;
		const productsRes = await fetch(productsUrl);
		if (!productsRes.ok) {
			throw error(productsRes.status, {
				message: `API returnerte ${productsRes.status}: ${productsRes.statusText}`
			});
		}
		const productsData = await productsRes.json();

		return {
			release: {
				...releaseInfo,
				formatted_date: formatDate(releaseInfo.release_date),
				products: productsData.results || []
			}
		};
	} catch (err: any) {
		console.error('Error fetching release:', err);

		throw error(500, {
			message: 'Kunne ikke laste data'
		});
	}
};
