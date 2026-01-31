import type { RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = getSession(cookies);

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			throw error(400, 'No file provided');
		}

		const apiFormData = new FormData();
		apiFormData.append('file', file);

		const apiUrl = `${API_URL}/beers/bulk_mark_tasted/`;
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				Cookie: `session=${session}`
			},
			body: apiFormData
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw error(response.status, `Failed to import: ${errorText}`);
		}

		const data = await response.json();
		return json(data, { status: response.status });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
