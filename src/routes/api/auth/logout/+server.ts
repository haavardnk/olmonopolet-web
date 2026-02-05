import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('session', { path: '/' });

	return json({ success: true }, { headers: NO_CACHE_HEADERS });
};
