import type { PageServerLoad } from './$types';
import { handleTokenAuth } from '$lib/server/token-auth';

export const load: PageServerLoad = async ({ url, cookies, locals }) => {
	return handleTokenAuth(url, cookies, locals, '/lists/import');
};
