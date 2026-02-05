import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const { id } = params;
	const session = getSession(cookies);

	try {
		const apiUrl = `${API_URL}/beers/${id}/mark_tasted/`;
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `session=${session}`
			}
		});

		if (!response.ok) {
			throw error(response.status, `Failed to mark as tasted: ${response.statusText}`);
		}

		const data = await response.json();
		return json(data, { status: response.status, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const { id } = params;
	const session = getSession(cookies);

	try {
		const apiUrl = `${API_URL}/beers/${id}/mark_tasted/`;
		const response = await fetch(apiUrl, {
			method: 'DELETE',
			headers: {
				Cookie: `session=${session}`
			}
		});

		if (!response.ok) {
			throw error(response.status, `Failed to unmark as tasted: ${response.statusText}`);
		}

		return new Response(null, { status: 204, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
