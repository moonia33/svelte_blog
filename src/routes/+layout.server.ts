// file: src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import type { Category } from '$lib/types/category';
import { apiFetch } from '$lib/utils/api';

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const json = await apiFetch('/categories', fetch);

		const menu2 = (json.data as Category[]).map((cat) => ({
			name: cat.name,
			slug: cat.slug,
			help: cat.description ?? ''
		}));

		return { menu2 };
	} catch (err) {
		console.error('Klaida kraunant kategorijas:', err);
		return { menu2: [] };
	}
};
