import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const target = token
		? `/profile/import-tasted/?token=${encodeURIComponent(token)}`
		: '/profile/import-tasted/';
	throw redirect(301, target);
};