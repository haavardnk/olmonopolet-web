import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const session = getSession(cookies);
	const username = url.searchParams.get('username');
	if (!username) throw error(400, 'Missing username parameter');

	try {
		const res = await fetch(
			`${API_URL}/untappd-lists/search/?username=${encodeURIComponent(username)}`,
			{
				headers: { Cookie: `session=${session}` }
			}
		);
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
