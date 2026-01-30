import { api } from './client';

export async function markAsTasted(beerId: string): Promise<Response> {
	return api.post(`/api/tasted/${beerId}`, {});
}

export async function unmarkAsTasted(beerId: string): Promise<Response> {
	return api.delete(`/api/tasted/${beerId}`);
}
