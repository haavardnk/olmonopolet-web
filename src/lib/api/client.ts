import { browser } from '$app/environment';
import { auth } from '$lib/firebase/client';

export async function getAuthToken(): Promise<string | null> {
	if (!browser || !auth?.currentUser) return null;

	try {
		return await auth.currentUser.getIdToken();
	} catch {
		return null;
	}
}

export async function authenticatedFetch(
	endpoint: string,
	options: RequestInit = {},
	baseUrl?: string
): Promise<Response> {
	const token = await getAuthToken();
	const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...options.headers
	};

	if (token) {
		(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		...options,
		headers
	});

	if (response.status === 401 && browser && auth) {
		const { signOut } = await import('firebase/auth');
		await signOut(auth);
	}

	return response;
}

export const api = {
	get: (endpoint: string, baseUrl?: string) =>
		authenticatedFetch(endpoint, { method: 'GET' }, baseUrl),

	post: (endpoint: string, data: unknown, baseUrl?: string) =>
		authenticatedFetch(
			endpoint,
			{
				method: 'POST',
				body: JSON.stringify(data)
			},
			baseUrl
		),

	put: (endpoint: string, data: unknown, baseUrl?: string) =>
		authenticatedFetch(
			endpoint,
			{
				method: 'PUT',
				body: JSON.stringify(data)
			},
			baseUrl
		),

	patch: (endpoint: string, data: unknown, baseUrl?: string) =>
		authenticatedFetch(
			endpoint,
			{
				method: 'PATCH',
				body: JSON.stringify(data)
			},
			baseUrl
		),

	delete: (endpoint: string, baseUrl?: string) =>
		authenticatedFetch(endpoint, { method: 'DELETE' }, baseUrl)
};
