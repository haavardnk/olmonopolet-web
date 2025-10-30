import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import type {
	Product,
	Release,
	ProductStats,
	ApiProduct,
	ApiRelease,
	ProductListResponse
} from '$lib/types';
import { formatDate, slugify, unslugify, getAssortmentDisplayName } from '$lib/utils/helpers';

export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
	setHeaders({
		'Cache-Control': 'public, max-age=300, s-maxage=3600'
	});

	const name = unslugify(params.id);
	try {
		const releaseInfoUrl = `${API_URL}/release/${encodeURIComponent(name)}/?fields=name,release_date,beer_count,product_selections,product_stats,is_christmas_release`;
		const releaseInfoRes = await fetch(releaseInfoUrl);
		if (!releaseInfoRes.ok) {
			if (releaseInfoRes.status === 404) {
				throw error(404, { message: 'Lansering ikke funnet' });
			}
			throw error(releaseInfoRes.status, {
				message: `API returnerte ${releaseInfoRes.status}: ${releaseInfoRes.statusText}`
			});
		}
		const releaseInfo: ApiRelease = await releaseInfoRes.json();

		const fields =
			'vmp_id,vmp_name,price,rating,checkins,label_sm_url,main_category,sub_category,style,is_christmas_beer,stock,abv,user_checked_in,user_wishlisted,volume,price_per_volume,vmp_url,untpd_url,untpd_id,country,country_code,product_selection';
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
		const productsData: ProductListResponse = await productsRes.json();

		const products: Product[] = (productsData.results || []).map((p: ApiProduct) => ({
			id: p.vmp_id,
			name: p.vmp_name,
			image: p.label_sm_url,
			price: p.price,
			volume: p.volume,
			pricePerLiter: p.price_per_volume,
			style: p.style || p.sub_category || p.main_category,
			isChristmasBeer: p.is_christmas_beer,
			rating: p.rating,
			checkins: p.checkins,
			strength: p.abv,
			ibu: p.ibu,
			alcoholUnits: p.alcohol_units,
			country: p.country,
			countryCode: p.country_code,
			assortment: getAssortmentDisplayName(p.product_selection),
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
			assortments: (releaseInfo.product_selections || [])
				.map((ps: string) => getAssortmentDisplayName(ps))
				.filter((name: string | null): name is string => name !== null),
			isChristmasRelease: releaseInfo.is_christmas_release,
			products,
			stats
		};

		return {
			release,
			slug: slugify(releaseInfo.name)
		};
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, { message: 'Serverfeil' });
	}
};
