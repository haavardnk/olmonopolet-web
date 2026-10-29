import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { ProductStats } from '$lib/types';

export function slugify(str: string): string {
	return str.replace(/\s+/g, '-');
}

export function unslugify(slug: string): string {
	return slug.replace(/-/g, ' ');
}

export function formatDate(dateString: string): string {
	try {
		const date = parseISO(dateString);
		let [day, month, year] = format(date, 'd. MMMM yyyy', { locale: nb }).split(' ');
		if (month) month = month.charAt(0).toUpperCase() + month.slice(1);
		return [day, month, year].filter(Boolean).join(' ');
	} catch (error) {
		console.error('Date parsing error:', error);
		return dateString;
	}
}

export function normalizeCharacteristic(value: number | null | undefined): number | null {
	if (value == null) return null;
	return Math.round((value / 12) * 100);
}

export function getStarRating(rating: number) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
	return { fullStars, hasHalfStar, emptyStars };
}

export function getAssortmentDisplayName(apiValue: string | null | undefined): string | null {
	if (!apiValue) return null;
	if (apiValue === 'Spesialutvalg') return 'Spesialutvalget';
	return apiValue;
}

export type Season = 'christmas' | 'winter' | 'default';

export function getSeason(date: Date = new Date()): Season {
	if (dev && env.PUBLIC_SEASON) return env.PUBLIC_SEASON as Season;
	const [month, day] = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Europe/Oslo',
		month: 'numeric',
		day: 'numeric'
	})
		.format(date)
		.split('/')
		.map(Number);
	if (month >= 11 || (month === 10 && day >= 30)) return 'christmas';
	if (month <= 2) return 'winter';
	return 'default';
}

export function formatReleaseDescription(stats: ProductStats): string {
	const base = `Produkter i lansering: ${stats.productCount} (${stats.beerCount} øl, ${stats.ciderCount} sider, ${stats.meadCount} mjød)`;
	return stats.christmasBeerCount ? `${base}, hvorav ${stats.christmasBeerCount} juleøl` : base;
}
