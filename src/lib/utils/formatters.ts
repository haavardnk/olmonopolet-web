export function formatLongDate(dateStr: string | null): string {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('nb-NO', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}

export function formatShortDate(dateStr: string | null): string {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	return date.toLocaleDateString('nb-NO', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

export function formatISODate(dateStr: string | null): string {
	if (!dateStr) return '';
	return dateStr.split('T')[0];
}

export function formatCurrency(amount: number | null | undefined, includeDecimals = false): string {
	if (amount === null || amount === undefined) return '';
	const formatted = includeDecimals ? amount.toFixed(2) : amount.toFixed(0);
	return `${Number(formatted).toLocaleString('nb-NO')} kr`;
}

export function formatNumber(value: number | null | undefined): string {
	if (value === null || value === undefined) return '';
	return value.toLocaleString('nb-NO');
}

export function getProductCountLabel(count: number): string {
	return `${count} ${count === 1 ? 'produkt' : 'produkter'}`;
}

export function getBottleCountLabel(count: number): string {
	return `${count} ${count === 1 ? 'flaske' : 'flasker'}`;
}
