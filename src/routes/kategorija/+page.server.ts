import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, depends, url }) => {
	depends('app:articles'); // Add dependency to trigger reloads

	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 4; // Ribojame straipsnius po 4 puslapyje

	try {
		// Ensure API URL is properly formatted
		const baseUrl = PUBLIC_API_URL.replace(/\/$/, '');

		// Fetch all articles with pagination
		const articlesResponse = await fetch(
			`${baseUrl}/straipsniais?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=Data:desc`
		);

		if (!articlesResponse.ok) {
			throw error(articlesResponse.status, 'Nepavyko gauti straipsnių');
		}

		const articlesData = await articlesResponse.json();

		return {
			articles: articlesData.data || [],
			pagination: articlesData.meta?.pagination || { page, pageCount: 1, total: 0 },
			currentPage: page,
			slug: ''
		};
	} catch (err) {
		console.error('Error loading articles data:', err);
		throw error(500, 'Įvyko klaida gaunant duomenis');
	}
};
