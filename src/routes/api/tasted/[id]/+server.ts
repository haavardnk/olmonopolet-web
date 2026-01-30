import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const { id } = params;
	const sessionCookie = cookies.get('session');

	if (!sessionCookie) {
		throw error(401, 'Not authenticated');
	}

	try {
		const apiUrl = `${API_URL}/beers/${id}/mark_tasted/`;
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `session=${sessionCookie}`
			}
		});

		if (!response.ok) {
			throw error(response.status, `Failed to mark as tasted: ${response.statusText}`);
		}

		const data = await response.json();
		return json(data, { status: response.status });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const { id } = params;
	const sessionCookie = cookies.get('session');

	if (!sessionCookie) {
		throw error(401, 'Not authenticated');
	}

	try {
		const apiUrl = `${API_URL}/beers/${id}/mark_tasted/`;
		const response = await fetch(apiUrl, {
			method: 'DELETE',
			headers: {
				Cookie: `session=${sessionCookie}`
			}
		});

		if (!response.ok) {
			throw error(response.status, `Failed to unmark as tasted: ${response.statusText}`);
		}

		return new Response(null, { status: 204 });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
