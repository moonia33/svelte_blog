// src/routes/slapukai/+page.server.ts
import { apiFetch } from '$lib/utils/api';
import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

export const load = async ({ fetch }) => {
	try {
		const res = await apiFetch('/cookie', fetch);

		if (!res || !res.data) {
			console.error('Nepavyko gauti cookie duomenų:', res);
			return {
				title: 'Slapukai',
				descriptionHtml: '<p>Informacijos kol kas nėra.</p>'
			};
		}

		const data = res.data;

		// Fix markdown - įsitikinant, kad antraštės turi tarpus po # simbolių
		let descriptionMarkdown = data?.Description ?? '';

		// Ištaisome markdown sintaksę - pridedame tarpą po # simbolių, jei jo nėra
		descriptionMarkdown = descriptionMarkdown.replace(/^(#{1,6})([^#\s])/gm, '$1 $2');

		console.log('Apdorotas markdown:', descriptionMarkdown);

		const descriptionHtml = await parseMarkdownWithClasses(descriptionMarkdown);
		console.log('Sugeneruotas HTML:', descriptionHtml);

		return {
			title: data?.Pavadinimas ?? 'Slapukai',
			descriptionHtml
		};
	} catch (err) {
		console.error('Klaida kraunant slapukų duomenis:', err);
		return {
			title: 'Slapukai',
			descriptionHtml: '<p>Įvyko klaida kraunant informaciją.</p>'
		};
	}
};
