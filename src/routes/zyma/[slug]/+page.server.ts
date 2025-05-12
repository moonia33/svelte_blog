// file: src/routes/zyma/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/utils/api';
import type { Tag } from '$lib/types/article';

export const load: PageServerLoad = async ({ params, fetch, depends, url }) => {
	depends('app:tag');

	const { slug } = params;
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 12;

	if (!slug) {
		throw error(404, 'Žyma nerasta');
	}

	try {
		// Gauti žymą pagal slug
		const tagData = await apiFetch(`/tags?filters[slug][$eq]=${slug}`, fetch);

		const tag = tagData.data?.[0];
		if (!tag) {
			throw error(404, 'Žyma nerasta');
		}

		// Paruošti žymos objektą
		const tagName = tag.zyma || tag.zymas || tag.zymo || 'Nežinoma žyma';
		const pageTagData: Tag & { name: string } = {
			id: tag.id,
			zyma: tag.zyma,
			zymas: tag.zymas,
			zymo: tag.zymo,
			slug: tag.slug,
			name: tagName
		};

		// Gauti straipsnius šiai žymai
		const articlesData = await apiFetch(
			`/straipsniais?filters[tags][slug][$eq]=${slug}&populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=Data:desc`,
			fetch
		);

		return {
			tag: pageTagData,
			articles: articlesData.data || [],
			pagination: articlesData.meta?.pagination || { page, pageCount: 1, total: 0 },
			currentPage: page,
			slug,
			meta: {
				title: `Žyma: ${tagName}`,
				description: `Straipsniai pažymėti žyma "${tagName}"`
			}
		};
	} catch (err) {
		console.error('Klaida kraunant žymos duomenis:', err);

		if (err && typeof err === 'object' && 'status' in err && typeof err.status === 'number') {
			const status = err.status;
			let message = 'Įvyko serverio klaida.';

			if ('message' in err && typeof err.message === 'string') {
				message = err.message;
			}
			throw error(status, message);
		}

		throw error(500, 'Įvyko klaida gaunant duomenis');
	}
};
