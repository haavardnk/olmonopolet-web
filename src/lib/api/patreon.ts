import {
	PATREON_ACCESS_TOKEN,
	PATREON_CAMPAIGN_ID,
	PATREON_CLIENT_ID,
	PATREON_CLIENT_SECRET,
	PATREON_REFRESH_TOKEN
} from '$env/static/private';

export type PatreonPost = {
	id: string;
	title: string | null;
	content: string | null;
	url: string;
	publishedAt: string | null;
	isPublic: boolean;
};

type PatreonPostAttributes = {
	title: string | null;
	content: string | null;
	url: string;
	published_at: string | null;
	is_public: boolean | null;
};

type PatreonApiPost = {
	id: string;
	attributes: PatreonPostAttributes;
	type: 'post';
};

type PatreonPostsResponse = {
	data: PatreonApiPost[];
	meta?: {
		pagination?: {
			total?: number;
		};
	};
};

type PatreonTokenResponse = {
	access_token: string;
	expires_in: number;
};

const TOKEN_URL = 'https://www.patreon.com/api/oauth2/token';

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function refreshAccessToken(): Promise<string | null> {
	if (!PATREON_CLIENT_ID || !PATREON_CLIENT_SECRET || !PATREON_REFRESH_TOKEN) return null;

	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: PATREON_REFRESH_TOKEN,
			client_id: PATREON_CLIENT_ID,
			client_secret: PATREON_CLIENT_SECRET
		})
	});

	if (!res.ok) {
		console.error(`Patreon token refresh error: ${res.status} ${res.statusText}`);
		return null;
	}

	const data: PatreonTokenResponse = await res.json();
	cachedAccessToken = data.access_token;
	tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
	return cachedAccessToken;
}

async function getAccessToken(forceRefresh: boolean = false): Promise<string | null> {
	if (!forceRefresh && cachedAccessToken && Date.now() < tokenExpiresAt) {
		return cachedAccessToken;
	}
	const refreshed = await refreshAccessToken();
	if (refreshed) return refreshed;
	return PATREON_ACCESS_TOKEN || null;
}

function requestPosts(url: string, token: string): Promise<Response> {
	return fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
			'User-Agent': 'Olmonopolet - Website'
		}
	});
}

export async function fetchPatreonPosts(count: number = 5): Promise<PatreonPost[]> {
	if (!PATREON_CAMPAIGN_ID) return [];

	try {
		const fields = 'title,content,url,published_at,is_public';
		const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${PATREON_CAMPAIGN_ID}/posts?fields%5Bpost%5D=${fields}&page%5Bcount%5D=${count}&sort=-published_at`;

		let token = await getAccessToken();
		if (!token) return [];

		let res = await requestPosts(url, token);
		if (res.status === 401) {
			token = await getAccessToken(true);
			if (!token) return [];
			res = await requestPosts(url, token);
		}

		if (!res.ok) {
			console.error(`Patreon API error: ${res.status} ${res.statusText}`);
			return [];
		}

		const data: PatreonPostsResponse = await res.json();

		return data.data
			.filter((post) => post.attributes.is_public)
			.map((post) => {
				const rawUrl = post.attributes.url;
				const url = rawUrl.startsWith('http') ? rawUrl : `https://www.patreon.com${rawUrl}`;
				return {
					id: post.id,
					title: post.attributes.title,
					content: post.attributes.content,
					url,
					publishedAt: post.attributes.published_at,
					isPublic: post.attributes.is_public ?? false
				};
			})
			.sort((a, b) => {
				if (!a.publishedAt || !b.publishedAt) return 0;
				return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
			});
	} catch (err) {
		console.error('Patreon fetch failed:', err);
		return [];
	}
}
