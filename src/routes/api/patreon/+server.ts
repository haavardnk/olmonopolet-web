import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { apiFetch } from '$lib/server/apiFetch';
import { MEDIUM_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async () => {
	try {
		const res = await apiFetch('/patreon/posts/');
		if (!res.ok) return json([], { headers: MEDIUM_CACHE_HEADERS });
		return json(await res.json(), { headers: MEDIUM_CACHE_HEADERS });
	} catch {
		return json([], { headers: MEDIUM_CACHE_HEADERS });
	}
};
