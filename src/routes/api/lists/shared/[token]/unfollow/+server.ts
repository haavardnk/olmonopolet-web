import type { RequestHandler } from './$types';
import { apiFetch } from '$lib/server/apiFetch';
import { error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const session = getSession(cookies);
	try {
		const res = await apiFetch(`/lists/shared/${params.token}/unfollow/`, {
			method: 'DELETE',
			headers: { Cookie: `session=${session}` }
		});
		if (!res.ok && res.status !== 404) throw error(res.status, await res.text());
		return new Response(null, { status: 204 });
	} catch (err: any) {
		if (err.status) throw err;
		throw error(500, 'Internal server error');
	}
};
