import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, depends, url }) => {
	depends('app:category'); // Add dependency to trigger reloads

	const { slug } = params;
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 4; // Ribojame straipsnius po 4 puslapyje

	if (!slug) {
		throw error(404, 'Kategorija nerasta');
	}

	try {
		// Ensure API URL is properly formatted
		const baseUrl = PUBLIC_API_URL.replace(/\/$/, '');

		// First, fetch the category info
		const categoryResponse = await fetch(`${baseUrl}/categories?filters[slug][$eq]=${slug}`);
		if (!categoryResponse.ok) {
			throw error(categoryResponse.status, 'Nepavyko gauti kategorijos');
		}
		const categoryData = await categoryResponse.json();
		if (!categoryData.data?.[0]) {
			throw error(404, 'Kategorija nerasta');
		}
		const category = categoryData.data[0];

		// Then fetch articles in this category with pagination
		const articlesResponse = await fetch(
			`${baseUrl}/straipsniais?filters[categories][slug][$eq]=${slug}&populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=Data:desc`
		);

		if (!articlesResponse.ok) {
			throw error(articlesResponse.status, 'Nepavyko gauti straipsnių');
		}

		const articlesData = await articlesResponse.json();

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
			slug: params.slug
		};
	} catch (err) {
		console.error('Error loading category data:', err);
		throw error(500, 'Įvyko klaida gaunant duomenis');
	}
};
