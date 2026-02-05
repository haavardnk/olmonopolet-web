import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/lists/${params.id}/products/${params.productId}/`, {
			method: 'POST',
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json(), { status: 201, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/lists/${params.id}/products/${params.productId}/`, {
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
