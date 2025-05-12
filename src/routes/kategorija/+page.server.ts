// file: src/routes/straipsniai/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/utils/api';

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:articles');

	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 12;
	const path = `/straipsniais?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=Data:desc`;

	try {
		const data = await apiFetch(path, fetch);

		return {
			articles: data.data || [],
			pagination: data.meta?.pagination || { page, pageCount: 1, total: 0 },
			currentPage: page,
			slug: ''
		};
	} catch (err) {
		console.error('Klaida kraunant straipsnius:', err);
		throw error(500, 'Nepavyko gauti straipsnių');
	}
};
