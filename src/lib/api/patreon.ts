import { PATREON_ACCESS_TOKEN, PATREON_CAMPAIGN_ID } from '$env/static/private';

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

export async function fetchPatreonPosts(count: number = 5): Promise<PatreonPost[]> {
	if (!PATREON_ACCESS_TOKEN || !PATREON_CAMPAIGN_ID) return [];

	try {
		const fields = 'title,content,url,published_at,is_public';
		const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${PATREON_CAMPAIGN_ID}/posts?fields%5Bpost%5D=${fields}&page%5Bcount%5D=${count}&sort=-published_at`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${PATREON_ACCESS_TOKEN}`,
				'User-Agent': 'Olmonopolet - Website'
			}
		});

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
