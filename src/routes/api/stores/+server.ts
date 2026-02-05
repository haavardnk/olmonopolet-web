import { json } from '@sveltejs/kit';
import { fetchStores } from '$lib/api/products';
import { LONG_CACHE_HEADERS } from '$lib/server/cache';

export async function GET() {
	try {
		const response = await fetchStores();

		return json({
			stores: response.results.map((store) => ({
				store_id: store.store_id,
				name: store.name,
				lat: store.gps_lat,
				lng: store.gps_long
			})),
			total: response.count
		}, { headers: LONG_CACHE_HEADERS });
	} catch (error) {
		console.error('Error loading stores:', error);
		return json(
			{
				stores: [],
				total: 0,
				error: 'Kunne ikke laste butikker'
			},
			{ status: 500 }
		);
	}
}
