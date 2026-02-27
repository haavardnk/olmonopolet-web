import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { createSessionCookie, verifyIdToken } from '$lib/firebase/admin.server';

const MAX_AGE = 60 * 60 * 24 * 5;

export async function handleTokenAuth(
	url: URL,
	cookies: Cookies,
	locals: App.Locals,
	redirectPath: string
): Promise<{ user: App.Locals['user'] | null }> {
	const token = url.searchParams.get('token');

	if (token) {
		if (await verifyIdToken(token)) {
			const session = await createSessionCookie(token, MAX_AGE * 1000);

			if (session) {
				cookies.set('session', session, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge: MAX_AGE
				});
			}
		}

		throw redirect(307, redirectPath);
	}

	return { user: locals.user ?? null };
}
