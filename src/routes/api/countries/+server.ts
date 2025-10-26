import { json } from '@sveltejs/kit';
import { fetchCountries } from '../../../lib/api/products';

export async function GET() {
	try {
		const countries = await fetchCountries();

		return json({
			countries,
			total: countries.length
		});
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
