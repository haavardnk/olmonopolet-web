import type { Handle } from '@sveltejs/kit';
import { verifySessionCookie } from '$lib/firebase/admin.server';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');

	if (sessionCookie) {
		try {
			const decodedClaims = await verifySessionCookie(sessionCookie);

			if (decodedClaims) {
				event.locals.user = {
					uid: decodedClaims.uid,
					email: decodedClaims.email || null,
					emailVerified: decodedClaims.email_verified || false
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
