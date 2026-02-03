import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSessionCookie, verifyIdToken } from '$lib/firebase/admin.server';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken } = await request.json();

		if (!idToken) {
			return json({ error: 'ID token required' }, { status: 400 });
		}

		const decodedToken = await verifyIdToken(idToken);
		if (!decodedToken) {
			return json({ error: 'Invalid ID token' }, { status: 401 });
		}

		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
		const sessionCookie = await createSessionCookie(idToken, expiresIn);

		if (!sessionCookie) {
			return json({ error: 'Failed to create session' }, { status: 500 });
		}

		cookies.set('session', sessionCookie, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 5
		});

		return json({
			success: true,
			user: {
				uid: decodedToken.uid,
				email: decodedToken.email
			}
		});
	} catch {
		return json({ error: 'Failed to create session' }, { status: 500 });
	}
};
