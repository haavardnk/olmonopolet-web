import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/lists/${params.id}/`, {
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json());
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
	const session = getSession(cookies);
	try {
		const body = await request.json();
		const res = await fetch(`${API_URL}/lists/${params.id}/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Cookie: `session=${session}` },
			body: JSON.stringify(body)
		});
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json());
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await fetch(`${API_URL}/lists/${params.id}/`, {
			method: 'DELETE',
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return new Response(null, { status: 204 });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
