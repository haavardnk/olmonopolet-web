import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	const session = getSession(cookies);
	try {
		const body = await request.json();
		const res = await fetch(`${API_URL}/lists/${params.id}/items/reorder/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', Cookie: `session=${session}` },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			const text = await res.text();
			throw error(res.status, text || 'Failed to reorder');
		}
		const text = await res.text();
		if (!text) return json({ success: true });
		return json(JSON.parse(text));
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, err.message || 'Internal server error');
	}
};
