import type { RequestHandler } from './$types';
import { apiFetch } from '$lib/server/apiFetch';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await apiFetch(`/auth/extension-token/`, {
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await apiFetch(`/auth/extension-token/`, {
			method: 'DELETE',
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return new Response(null, { status: 204, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
