import { PUBLIC_API_URL } from '$env/static/public';
import { marked } from 'marked';
import type { Article } from '$lib/types/article';

export const load = async ({ fetch }) => {
	const res = await fetch(
		`${PUBLIC_API_URL}/straipsniais?populate=*&sort=Data:desc&pagination[limit]=6`
	);
	const json = await res.json();
	return {
		articles: json.data.map((a: Article) => ({
			slug: a.slug,
			Title: a.Title,
			IlgasPavadinimas: a.IlgasPavadinimas,
			Data: a.Data || a.publishedAt || a.createdAt,
			Tekstas: a.Tekstas,
			TekstasHtml: marked.parse(a.Tekstas || ''),
			categories: a.categories || [],
			tags: a.tags || []
		}))
	};
};
