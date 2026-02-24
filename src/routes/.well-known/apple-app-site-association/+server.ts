import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({
		applinks: {
			apps: [],
			details: [
				{
					appID: 'HD2U84BBFQ.com.beermonopoly.olmonopolet',
					paths: ['/', '/release', '/release/*', '/products', '/products/*', '/lists', '/lists/*']
				}
			]
		}
	});
};
