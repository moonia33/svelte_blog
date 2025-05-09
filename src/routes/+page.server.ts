import { PUBLIC_API_URL } from '$env/static/public';
import { marked } from 'marked';
import type { Article } from '$lib/types/article';

export const load = async ({ fetch }) => {
	const res = await fetch(
		`${PUBLIC_API_URL}/straipsniais?fields=slug,Title,IlgasPavadinimas,Data,Tekstas&sort=Data:desc`
	);
	const json = await res.json();
	return {
		articles: json.data.map((a: Article) => ({
			slug: a.slug,
			Title: a.Title,
			IlgasPavadinimas: a.IlgasPavadinimas,
			Data: a.Data,
			Tekstas: a.Tekstas,
			TekstasHtml: marked.parse(a.Tekstas || '')
		}))
	};
};
