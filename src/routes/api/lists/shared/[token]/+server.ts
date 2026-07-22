import type { RequestHandler } from './$types';
import { apiFetch } from '$lib/server/apiFetch';
import { json, error } from '@sveltejs/kit';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const res = await apiFetch(`/lists/shared/${params.token}/`);
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
