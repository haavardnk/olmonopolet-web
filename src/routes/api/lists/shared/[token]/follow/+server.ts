import type { RequestHandler } from './$types';
import { apiFetch } from '$lib/server/apiFetch';
import { error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await apiFetch(`/lists/shared/${params.token}/follow/`, {
			method: 'POST',
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok) throw error(res.status, await res.text());
		return new Response(null, { status: res.status });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
