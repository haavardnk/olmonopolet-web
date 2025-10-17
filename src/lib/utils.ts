import { format, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

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

export function slugify(str: string): string {
	return str.replace(/\s+/g, '-');
}

export function unslugify(slug: string): string {
	return slug.replace(/-/g, ' ');
}
