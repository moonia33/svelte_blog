/**
 * Suformatuoja datą į lietuviško formato datą
 * Pvz.: 2023 m. sausio 15 d.
 */
export function formatDate(date: Date): string {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
		return '';
	}

	const months = [
		'sausio',
		'vasario',
		'kovo',
		'balandžio',
		'gegužės',
		'birželio',
		'liepos',
		'rugpjūčio',
		'rugsėjo',
		'spalio',
		'lapkričio',
		'gruodžio'
	];

	const year = date.getFullYear();
	const month = months[date.getMonth()];
	const day = date.getDate();

	return `${year} m. ${month} ${day} d.`;
}

/**
 * Suformatuoja datą į trumpesnį formatą
 * Pvz.: 2023-01-15
 */
export function formatShortDate(date: Date): string {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
		return '';
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
