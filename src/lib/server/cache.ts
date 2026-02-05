export const NO_CACHE_HEADERS = {
	'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
	'CDN-Cache-Control': 'no-store',
	'Cloudflare-CDN-Cache-Control': 'no-store',
	Pragma: 'no-cache',
	Expires: '0'
} as const;

export const LONG_CACHE_HEADERS = {
	'Cache-Control': 'public, max-age=3600, s-maxage=86400'
} as const;

export const MEDIUM_CACHE_HEADERS = {
	'Cache-Control': 'public, max-age=300, s-maxage=3600'
} as const;

export const SHORT_CACHE_HEADERS = {
	'Cache-Control': 'public, max-age=60, s-maxage=300'
} as const;
