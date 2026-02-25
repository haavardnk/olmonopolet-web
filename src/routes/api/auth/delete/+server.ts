import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminAuth } from '$lib/firebase/admin.server';
import { verifySessionCookie } from '$lib/firebase/admin.server';
import { NO_CACHE_HEADERS } from '$lib/server/cache';

export const DELETE: RequestHandler = async ({ cookies }) => {
	try {
		const sessionCookie = cookies.get('session');
		if (!sessionCookie) {
			return json({ error: 'Not authenticated' }, { status: 401, headers: NO_CACHE_HEADERS });
		}

		const decodedClaims = await verifySessionCookie(sessionCookie);
		if (!decodedClaims) {
			return json({ error: 'Invalid session' }, { status: 401, headers: NO_CACHE_HEADERS });
		}

		await adminAuth.deleteUser(decodedClaims.uid);

		cookies.delete('session', { path: '/' });

		return json({ success: true }, { headers: NO_CACHE_HEADERS });
	} catch {
		return json({ error: 'Failed to delete account' }, { status: 500, headers: NO_CACHE_HEADERS });
	}
};
