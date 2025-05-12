// file: src/routes/straipsniai/[slug]/+page.server.ts

import { error } from '@sveltejs/kit';
import type { Article, Tag } from '$lib/types/article'; // Importuojame Tag
import type { PageServerLoad } from './$types';
import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';
import { apiFetch } from '$lib/utils/api';
import { resolveImageUrl } from '$lib/utils/resolveImage';

interface ApiResponse {
	data: Array<
		Article & {
			tags: Array<Tag>; // Naudojame importuotą Tag tipą
		}
	>;
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const { slug } = params;

		// Užklausa per centralizuotą apiFetch
		const json: ApiResponse = await apiFetch(
			`/straipsniais?filters[slug][$eq]=${slug}&populate=*&sort=Data:desc`,
			fetch
		);

		const item = json.data?.[0];
		if (!item) {
			throw error(404, 'Straipsnis nerastas');
		}
		const imageUrl = resolveImageUrl(item.Nuotrauka, 'large');
		// const imageBase = PUBLIC_MEDIA_URL.replace(/\/+$/, '');
		// const imageUrl = item.Nuotrauka?.formats?.large?.url
		// 	? `${imageBase}${item.Nuotrauka.formats.large.url}`
		// 	: item.Nuotrauka?.url
		// 		? `${imageBase}${item.Nuotrauka.url}`
		// 		: null;

		let parsedText: string;
		try {
			parsedText = await parseMarkdownWithClasses(item.Tekstas || '');
		} catch (e) {
			console.error('Markdown klaida:', e);
			parsedText = typeof item.Tekstas === 'string' ? item.Tekstas : '';
		}

		const processedArticle = {
			...item,
			TekstasHtml: parsedText,
			Image: imageUrl,
			Data: new Date(item.Data).toISOString(),
			tags:
				item.tags?.map((tag) => ({
					...tag,
					name: tag.zyma || tag.zymas || tag.zymo || 'Unknown'
				})) || []
		};

		return { article: processedArticle };
	} catch (err) {
		console.error('Klaida kraunant straipsnį:', err);
		throw error(500, 'Klaida apdorojant straipsnį');
	}
};
