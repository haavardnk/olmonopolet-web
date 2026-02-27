import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const POST: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/rss/sync/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Cookie: `session=${session}` }
		});
		if (!res.ok) {
			const text = await res.text();
			throw error(res.status, text);
		}
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
