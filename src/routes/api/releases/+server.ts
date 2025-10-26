import { json } from '@sveltejs/kit';
import { fetchReleases } from '$lib/api/products';

export async function GET() {
	try {
		const response = await fetchReleases();

		return json({
			releases: response.results,
			total: response.count
		});
	} catch (error) {
		console.error('Error loading releases:', error);
		return json(
			{
				releases: [],
				total: 0,
				error: 'Kunne ikke laste lanseringer'
			},
			{ status: 500 }
		);
	}
}
