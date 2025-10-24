import { json } from '@sveltejs/kit';
import { fetchStores } from '$lib/api/products';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetchStores();

		return json({
			stores: response.results,
			total: response.count
		});
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
};
