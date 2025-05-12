// file: src/routes/kategorijos/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/utils/api';

export const load: PageServerLoad = async ({ params, fetch, depends, url }) => {
	depends('app:category');

	const { slug } = params;
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 12;

	if (!slug) {
		throw error(404, 'Kategorija nerasta');
	}

	try {
		// Gauti kategoriją pagal slug
		const categoryData = await apiFetch(`/categories?filters[slug][$eq]=${slug}`, fetch);

		const category = categoryData.data?.[0];
		if (!category) {
			throw error(404, 'Kategorija nerasta');
		}

		// Gauti straipsnius šiai kategorijai
		const articlesData = await apiFetch(
			`/straipsniais?filters[categories][slug][$eq]=${slug}&populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=Data:desc`,
			fetch
		);

		return {
			category: {
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description
			},
			articles: articlesData.data || [],
			pagination: articlesData.meta?.pagination || { page, pageCount: 1, total: 0 },
			currentPage: page,
			slug
		};
	} catch (err) {
		console.error('Klaida kraunant kategorijos duomenis:', err);
		throw error(500, 'Įvyko klaida gaunant duomenis');
	}
};
