// file: src/lib/utils/api.ts
import { PUBLIC_API_URL } from '$env/static/public';
import { PRIVATE_API_TOKEN } from '$env/static/private';

interface FetchOptions extends RequestInit {
	headers?: HeadersInit;
}

/**
 * Atliekamas API užklausos kvietimas su bendrais nustatymais
 */
export async function apiFetch(
	path: string,
	fetch: typeof globalThis.fetch,
	options: FetchOptions = {}
) {
	try {
		const baseUrl = PUBLIC_API_URL.replace(/\/$/, '');
		const url = `${baseUrl}${path}`;

		console.log(`API kvietimas: ${url}`);

		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${PRIVATE_API_TOKEN}`,
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`API klaida ${response.status} (${url}):`, errorText);

			const errorObj = {
				status: response.status,
				message: `API klaida: ${response.statusText}`
			};

			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.error && errorJson.error.message) {
					errorObj.message = errorJson.error.message;
				}
			} catch (parseError) {
				// Jei ne JSON, naudojame tekstą kaip pranešimą
				console.warn('Nepavyko išanalizuoti API klaidos atsakymo kaip JSON:', parseError);
				errorObj.message = `API klaida (${response.status}): ${errorText.substring(0, 100)}`;
			}

			throw errorObj;
		}

		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const data = await response.json();
			return data;
		} else {
			const text = await response.text();
			return { data: text };
		}
	} catch (error) {
		console.error('API kvietimo klaida:', error);
		if (error && typeof error === 'object' && 'status' in error) {
			throw error; // Permetame jau suformuotą klaidos objektą
		}
		throw {
			status: 500,
			message: error instanceof Error ? error.message : 'Nežinoma API klaida'
		};
	}
}
