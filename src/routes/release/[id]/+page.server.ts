import { formatDate, slugify, unslugify } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const name = unslugify(params.id);
	try {
		const releaseInfoUrl = `${API_URL}/release/${encodeURIComponent(name)}/?fields=name,release_date,beer_count,product_selections,product_stats`;
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
		const productsUrl = `${API_URL}/beers/?fields=${fields}&release=${encodeURIComponent(name)}&ordering=-rating&page_size=1000`;
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
				product_selections: (releaseInfo.product_selections || []).map((ps: any) =>
					ps === 'Spesialutvalg' ? 'Spesialutvalget' : ps
				),
				products: (productsData.results || []).map((product: any) => ({
					...product,
				}))
			},
			slug: slugify(releaseInfo.name)
		};
	} catch (err) {
		throw error(500, { message: 'Serverfeil' });
	}
};
