import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { fetchPatreonPosts } from '$lib/api/patreon';
import { MEDIUM_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async () => {
	const posts = await fetchPatreonPosts(10);
	return json(posts, { headers: MEDIUM_CACHE_HEADERS });
};
