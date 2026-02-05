import { json } from '@sveltejs/kit';
import { fetchCountries } from '../../../lib/api/products';
import { LONG_CACHE_HEADERS } from '$lib/server/cache';

export async function GET() {
	try {
		const countries = await fetchCountries();

		return json({
			countries,
			total: countries.length
		}, { headers: LONG_CACHE_HEADERS });
	} catch (error) {
		console.error('Error loading countries:', error);
		return json(
			{
				countries: [],
				total: 0,
				error: 'Kunne ikke laste land'
			},
			{ status: 500 }
		);
	}
}
