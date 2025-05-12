// failas: src/routes/pagrindinis/+page.server.ts
import type { Article } from '$lib/types/article';
import { apiFetch } from '$lib/utils/api';
import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';
import { resolveImageUrl } from '$lib/utils/resolveImage';

export const load = async ({ fetch }) => {
	const json = await apiFetch('/straipsniais?populate=*&sort=Data:desc&pagination[limit]=6', fetch);

	const metaJson = await apiFetch(
		'/pagrindinis?fields=Pavadinimas,Description&populate=seo',
		fetch
	);
	const data = metaJson.data;

	const pavadinimas = data?.Pavadinimas ?? '';
	const descriptionMarkdown = data?.Description ?? '';
	const seoTitle = data?.seo?.metaTitle ?? '';
	const seoDescription = data?.seo?.metaDescription ?? '';
	const descriptionHtml = await parseMarkdownWithClasses(descriptionMarkdown);

	const articles = await Promise.all(
		json.data.map(async (a: Article) => ({
			slug: a.slug,
			Title: a.Title,
			IlgasPavadinimas: a.IlgasPavadinimas,
			Data: a.Data || a.publishedAt || a.createdAt,
			Tekstas: a.Tekstas,
			TekstasHtml: await parseMarkdownWithClasses(a.Tekstas || ''),
			Image: resolveImageUrl(a.Nuotrauka),
			categories: a.categories || [],
			tags: a.tags || []
		}))
	);

	return {
		pavadinimas,
		descriptionHtml,
		seo: {
			title: seoTitle,
			description: seoDescription
		},
		articles
	};
};
