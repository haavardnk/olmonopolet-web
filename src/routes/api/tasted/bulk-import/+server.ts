import type { RequestHandler } from './$types';
import { apiFetch } from '$lib/server/apiFetch';
import { json, error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const session = getSession(cookies);

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			throw error(400, 'No file provided');
		}

		const apiFormData = new FormData();
		const fileBuffer = await file.arrayBuffer();
		const blob = new Blob([fileBuffer], {
			type: file.type || 'application/octet-stream'
		});
		apiFormData.append('file', blob, file.name || 'untappd-export');

		const apiUrl = `/beers/bulk_mark_tasted/`;
		const response = await apiFetch(apiUrl, {
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
		return json(data, { status: response.status, headers: NO_CACHE_HEADERS });
	} catch (err: any) {
		console.error('Bulk tasted import failed:', err);
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
