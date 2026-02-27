import { api } from './client';

export type RssFeed = {
	feed_url: string;
	last_synced: string | null;
	active: boolean;
	created_at: string;
};

export type RssSyncResult = {
	imported: number;
	synced: number;
};

export async function getRssFeed(): Promise<RssFeed | null> {
	const res = await api.get('/api/rss');
	if (res.status === 404) return null;
	if (!res.ok) throw new Error('Failed to fetch RSS feed');
	return res.json();
}

export async function createRssFeed(feedUrl: string): Promise<RssFeed> {
	const res = await api.post('/api/rss', { feed_url: feedUrl, active: true });
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		const msg = data?.error || data?.feed_url?.[0] || 'Failed to create RSS feed';
		throw new Error(msg);
	}
	return res.json();
}

export async function updateRssFeed(feedUrl: string, active: boolean): Promise<RssFeed> {
	const res = await api.put('/api/rss', { feed_url: feedUrl, active });
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		const msg = data?.error || data?.feed_url?.[0] || 'Failed to update RSS feed';
		throw new Error(msg);
	}
	return res.json();
}

export async function deleteRssFeed(): Promise<void> {
	const res = await api.delete('/api/rss');
	if (!res.ok) throw new Error('Failed to delete RSS feed');
}

export async function syncRssFeed(): Promise<RssSyncResult> {
	const res = await api.post('/api/rss/sync', {});
	if (!res.ok) {
		const data = await res.json().catch(() => null);
		throw new Error(data?.error || 'Failed to sync RSS feed');
	}
	return res.json();
}
