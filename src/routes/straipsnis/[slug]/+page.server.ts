import { PUBLIC_API_URL, PUBLIC_MEDIA_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { Article } from '$lib/types/article';
import type { PageServerLoad } from './$types';
import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

interface ApiResponse {
	data: Array<
		Article & {
			tags: Array<{ id: number; zyma?: string; zymas?: string; zymo?: string; slug: string }>;
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
		// Ensure API URL is properly formatted
		const baseUrl = PUBLIC_API_URL.replace(/\/+$/, '');
		const apiUrl = `${baseUrl}/straipsniais?filters[slug][$eq]=${slug}&populate=*`;

		console.log('Fetching article from:', apiUrl); // Debug log

		const res = await fetch(apiUrl);
		const responseText = await res.text();

		if (!res.ok) {
			console.error('Failed to fetch article:', responseText);
			throw error(404, 'Straipsnis nerastas');
		}

		let json: ApiResponse;
		try {
			json = JSON.parse(responseText);
		} catch (e) {
			console.error('Failed to parse JSON:', e);
			throw error(500, 'Klaida apdorojant duomenis');
		}

		const item = json.data?.[0];
		if (!item) {
			throw error(404, 'Straipsnis nerastas');
		}
		// Process image URL
		const imageUrl = item.Nuotrauka?.formats?.large?.url
			? `${PUBLIC_MEDIA_URL.replace(/\/+$/, '')}${item.Nuotrauka.formats.large.url}`
			: item.Nuotrauka?.url
				? `${PUBLIC_MEDIA_URL.replace(/\/+$/, '')}${item.Nuotrauka.url}`
				: null;
		// Parse markdown text safely with custom classes
		let parsedText: string;
		try {
			// Debug: spausdiname Tekstas tipą, kad žinotume, ką gauname
			console.log(
				'Tekstas tipas:',
				typeof item.Tekstas,
				'Vertė:',
				item.Tekstas?.substring?.(0, 50) || '[ne stringas]'
			);

			// Patikrinkime, ar tekste yra sąrašo elementų požymių
			const hasBulletList =
				String(item.Tekstas).includes('- ') ||
				String(item.Tekstas).includes('* ') ||
				String(item.Tekstas).includes('+ ');
			const hasNumberedList = /\d+\.\s/.test(String(item.Tekstas));
			console.log('Tekstas turi sąrašo elementų požymius:', { hasBulletList, hasNumberedList });

			// Apdorojame tekstą su mūsų specialiu parseriu
			parsedText = await parseMarkdownWithClasses(item.Tekstas || '');

			// Debug: patikriname rezultato ilgį ir ar yra sąrašo elementų
			console.log('Apdoroto teksto ilgis:', parsedText.length);
			console.log(
				'HTML fragmentas su sąrašais:',
				parsedText.match(/<[uo]l[^>]*>.*?<\/[uo]l>/gs)?.[0] || 'Nerasta'
			);
		} catch (e) {
			console.error('Failed to parse markdown:', e);
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
		console.error('Error loading article:', err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Klaida apdorojant straipsnį');
	}
};
