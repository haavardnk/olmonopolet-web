import { json } from '@sveltejs/kit';
import { fetchStyles } from '$lib/api/products';
import { LONG_CACHE_HEADERS } from '$lib/server/cache';

export async function GET() {
	try {
		const styles = await fetchStyles();

		return json({
			styles,
			total: styles.length
		}, { headers: LONG_CACHE_HEADERS });
	} catch (error) {
		console.error('Error loading styles:', error);
		return json(
			{
				styles: [],
				total: 0,
				error: 'Kunne ikke laste stiler'
			},
			{ status: 500 }
		);
	}
}
