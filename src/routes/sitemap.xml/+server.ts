// file: src/routes/sitemap.xml/+server.ts
import { apiFetch } from '$lib/utils/api';
import { PUBLIC_URL } from '$env/static/public';
import type { Article } from '$lib/types/article';
import type { Category } from '$lib/types/category';

export const GET = async ({ fetch }) => {
	const base = PUBLIC_URL.replace(/\/+$/, '');

	// Gauti straipsnius
	const articleJson = await apiFetch('/straipsniais?pagination[limit]=1000', fetch);
	const articles = articleJson.data;

	// Gauti kategorijas
	const categoryJson = await apiFetch('/categories?pagination[limit]=1000', fetch);
	const categories = categoryJson.data;

	// Gauti žymas (jei turi atskirą endpoint)
	const tagJson = await apiFetch('/tags?pagination[limit]=1000', fetch).catch(() => ({ data: [] }));
	const tags = tagJson.data;

	// Generuoti įrašus
	interface UrlEntry {
		loc: string;
		lastmod?: string;
		changefreq: string;
		priority: string;
	}

	interface Tag {
		slug: string;
	}

	const urls: UrlEntry[] = [
		// Pagrindinis
		{
			loc: `${base}/`,
			priority: '1.0',
			changefreq: 'daily'
		},
		// Straipsniai
		...articles.map(
			(a: Article): UrlEntry => ({
				loc: `${base}/straipsnis/${a.slug}`,
				lastmod: new Date(a.updatedAt).toISOString(),
				changefreq: 'weekly',
				priority: '0.8'
			})
		),
		// Kategorijos
		...categories.map(
			(c: Category): UrlEntry => ({
				loc: `${base}/kategorija/${c.slug}`,
				changefreq: 'weekly',
				priority: '0.6'
			})
		),
		// Žymos
		...tags.map(
			(t: Tag): UrlEntry => ({
				loc: `${base}/zyma/${t.slug}`,
				changefreq: 'weekly',
				priority: '0.5'
			})
		)
	];

	// Konvertuoti į XML
	const urlEntries = urls
		.map((u) => {
			return `
	<url>
		<loc>${u.loc}</loc>
		${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
		<changefreq>${u.changefreq}</changefreq>
		<priority>${u.priority}</priority>
	</url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
