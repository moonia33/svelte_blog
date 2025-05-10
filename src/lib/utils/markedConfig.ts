import { marked } from 'marked';

// Paprastesnė markdown apdorojimo funkcija, kuri prideda klases tik ul ir ol elementams
export async function parseMarkdownWithClasses(markdown: string): Promise<string> {
	// Objektas į string konvertavimas
	if (markdown && typeof markdown === 'object') {
		try {
			markdown = JSON.stringify(markdown);
		} catch (e) {
			console.error('Nepavyko konvertuoti objekto į tekstą:', e);
			markdown = '[Neįmanoma atvaizduoti turinio]';
		}
	}

	// Jei nėra teksto arba ne stringas - grąžiname tuščią stringą
	if (!markdown || typeof markdown !== 'string') {
		console.warn('Tekstas nėra stringas:', typeof markdown);
		return '';
	}

	try {
		// Tvarkyti sąrašų formatavimą, įsitikinant kad jie tinkamai atpažįstami
		let processedMarkdown = markdown;

		// Įsitikinant, kad prieš kiekvieną sąrašo elementą yra nauja eilutė
		processedMarkdown = processedMarkdown.replace(/([^\n])(\n[ \t]*[-*+][ \t]+)/g, '$1\n\n$2');
		processedMarkdown = processedMarkdown.replace(/([^\n])(\n[ \t]*\d+\.[ \t]+)/g, '$1\n\n$2');

		// Pirmiausia analizuojame markdown į HTML
		const html = await marked.parse(processedMarkdown);

		// Po to pridedame klases tik prie ul ir ol elementų, li elementų neliečiame
		const processedHtml = html
			.replace(/<ul>/g, '<ul class="article-ul">')
			.replace(/<ol>/g, '<ol class="article-ol">');

		// Pašalinkime [object Object] teksto gabalus
		return processedHtml.replace(/\[object Object\]/g, '');
	} catch (e) {
		console.error('Klaida apdorojant markdown:', e);
		return typeof markdown === 'string' ? markdown : '';
	}
}
