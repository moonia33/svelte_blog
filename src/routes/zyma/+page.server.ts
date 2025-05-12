// file: src/routes/zyma/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/utils/api';

export const load: PageServerLoad = async ({ fetch, depends }) => {
	depends('app:tags');

	try {
		// Gauti visas žymas
		const tagsData = await apiFetch(`/tags?populate=*&sort=zyma:asc`, fetch);

		return {
			tags: tagsData.data || [],
			meta: {
				title: 'Žymos | Teisinė Info',
				description: 'Visos teisinės informacijos žymos'
			}
		};
	} catch (err) {
		console.error('Klaida kraunant žymas:', err);

		if (err && typeof err === 'object' && 'status' in err && typeof err.status === 'number') {
			const status = err.status;
			let message = 'Įvyko serverio klaida.';

			if ('message' in err && typeof err.message === 'string') {
				message = err.message;
			}
			throw error(status, message);
		}

		throw error(500, 'Nepavyko gauti žymų');
	}
};
