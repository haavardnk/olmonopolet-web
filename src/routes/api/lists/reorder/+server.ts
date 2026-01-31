import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const session = getSession(cookies);

	try {
		const body = await request.json();
		const res = await fetch(`${API_URL}/lists/reorder/`, {
			method: 'PATCH',
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
