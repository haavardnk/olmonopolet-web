import { json } from '@sveltejs/kit';
import { fetchStyles } from '$lib/api/products';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const styles = await fetchStyles();

		return json({
			styles,
			total: styles.length
		});
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
};
