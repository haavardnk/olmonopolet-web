import type { Handle, RequestEvent } from '@sveltejs/kit';
import { verifySessionCookie } from '$lib/firebase/admin.server';
import { adminAuth } from '$lib/firebase/admin.server';

function isSameOriginRequest(event: RequestEvent): boolean {
	const site = event.request.headers.get('sec-fetch-site');
	if (site) return site === 'same-origin';

	const origin = event.request.headers.get('origin');
	if (origin) return origin === event.url.origin;

	const referer = event.request.headers.get('referer');
	if (referer) return referer.startsWith(`${event.url.origin}/`);

	return false;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/') && !isSameOriginRequest(event)) {
		return new Response('Forbidden', { status: 403 });
	}

	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		try {
			const decodedClaims = await verifySessionCookie(sessionCookie);

			if (decodedClaims) {
				let displayName: string | null = null;
				let photoURL: string | null = null;

				try {
					const userRecord = await adminAuth.getUser(decodedClaims.uid);
					displayName = userRecord.displayName ?? null;
					photoURL = userRecord.photoURL ?? null;
				} catch {}

				event.locals.user = {
					uid: decodedClaims.uid,
					email: decodedClaims.email || null,
					emailVerified: decodedClaims.email_verified || false,
					displayName,
					photoURL
				};
			} else {
				event.cookies.delete('session', { path: '/' });
				event.locals.user = null;
			}
		} catch {
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
