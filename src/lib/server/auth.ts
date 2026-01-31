import { error } from '@sveltejs/kit';

export function getSession(cookies: { get: (name: string) => string | undefined }): string {
	const session = cookies.get('session');
	if (!session) throw error(401, 'Not authenticated');
	return session;
}
