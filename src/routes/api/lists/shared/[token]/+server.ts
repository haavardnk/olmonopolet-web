import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const res = await fetch(`${API_URL}/lists/shared/${params.token}/`);
		if (!res.ok) throw error(res.status, await res.text());
		return json(await res.json());
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
