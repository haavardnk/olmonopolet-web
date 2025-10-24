import { formatDate, slugify, unslugify, normalizeAssortmentName } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product, Release, ProductStats } from '$lib/types';

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
			if (productsRes.status === 404) {
				throw error(404, { message: 'Øl ikke funnet' });
			}
			throw error(productsRes.status, {
				message: `API returnerte ${productsRes.status}: ${productsRes.statusText}`
			});
		}
		const productsData = await productsRes.json();

		const products: Product[] = (productsData.results || []).map((p: any) => ({
			id: p.vmp_id,
			name: p.vmp_name,
			image: p.label_sm_url,
			price: p.price,
			volume: p.volume,
			pricePerLiter: p.price_per_volume,
			style: p.style || p.sub_category || p.main_category,
			rating: p.rating,
			checkins: p.checkins,
			strength: p.abv,
			ibu: p.ibu,
			alcoholUnits: p.alcohol_units,
			country: p.country,
			assortment: normalizeAssortmentName(p.product_selection),
			vmpUrl: p.vmp_url,
			untappdUrl: p.untpd_url,
			stores: []
		}));

		const stats: ProductStats = {
			productCount: releaseInfo.product_stats.product_count,
			beerCount: releaseInfo.product_stats.beer_count,
			ciderCount: releaseInfo.product_stats.cider_count,
			meadCount: releaseInfo.product_stats.mead_count
		};

		const release: Release = {
			name: releaseInfo.name,
			releaseDate: releaseInfo.release_date,
			formattedDate: formatDate(releaseInfo.release_date),
			beerCount: releaseInfo.beer_count,
			assortments: (releaseInfo.product_selections || []).map((ps: string) =>
				normalizeAssortmentName(ps) || ps
			),
			products,
			stats
		};

		return {
			release,
			slug: slugify(releaseInfo.name)
		};
	} catch (err) {
		throw error(500, { message: 'Serverfeil' });
	}
};
