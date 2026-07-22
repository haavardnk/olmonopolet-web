import { API_URL, API_SERVER_KEY } from '$env/static/private';

export function apiFetch(
	path: string,
	init: RequestInit = {},
	fetchFn: typeof fetch = fetch
): Promise<Response> {
	const headers = new Headers(init.headers);
	headers.set('X-Api-Key', API_SERVER_KEY);
	return fetchFn(`${API_URL}${path}`, { ...init, headers });
}
