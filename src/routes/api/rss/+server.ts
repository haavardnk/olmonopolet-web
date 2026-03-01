import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const GET: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/rss/`, {
			headers: { Cookie: `session=${session}` }
		});
		if (res.status === 404) return json(null, { status: 404, headers: NO_CACHE_HEADERS });
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = getSession(cookies);
	try {
		const body = await request.json();
		const res = await fetch(`${API_URL}/rss/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Cookie: `session=${session}` },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const data = await res.json().catch(() => null);
			return json(data ?? { error: 'Unknown error' }, { status: res.status, headers: NO_CACHE_HEADERS });
		}
		return json(await res.json(), { status: 201, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const session = getSession(cookies);
	try {
		const body = await request.json();
		const res = await fetch(`${API_URL}/rss/me/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Cookie: `session=${session}` },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const data = await res.json().catch(() => null);
			return json(data ?? { error: 'Unknown error' }, { status: res.status, headers: NO_CACHE_HEADERS });
		}
		return json(await res.json(), { headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/rss/me/`, {
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
