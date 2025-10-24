import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

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

export const ASSORTMENT_DISPLAY_NAMES: Record<string, string> = {
	Spesialutvalg: 'Spesialutvalget'
};

export function normalizeAssortmentName(
	assortment: string | null | undefined
): string | null | undefined {
	if (!assortment) return assortment;
	return ASSORTMENT_DISPLAY_NAMES[assortment] || assortment;
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
