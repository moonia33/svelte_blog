// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import type { Category } from '$lib/types/category';

import { PUBLIC_API_URL } from '$env/static/public';

export const load: LayoutServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch(`${PUBLIC_API_URL.replace(/\/$/, '')}/categories`);
		if (!res.ok) {
			console.error('Failed to fetch categories:', await res.text());
			return { menu2: [] };
		}
		const json = await res.json();

		const menu2 = (json.data as Category[]).map((cat) => ({
			name: cat.name,
			slug: cat.slug,
			help: cat.description ?? ''
		}));

		return {
			menu2
		};
	} catch (err) {
		console.error('Error loading categories:', err);
		return {
			menu2: []
		};
	}
};
