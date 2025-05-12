import { PUBLIC_MEDIA_URL } from '$env/static/public';
import type { ArticleImage } from '$lib/types/article';

/**
 * Grąžina pilną paveikslėlio URL iš norimo formato.
 * Jei formatas nerastas, grąžina pagrindinį paveikslėlį.
 */
export function resolveImageUrl(
	image: ArticleImage | undefined | null,
	format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'
): string | null {
	const base = PUBLIC_MEDIA_URL.replace(/\/+$/, '');
	if (!image) return null;

	const formatUrl = image.formats?.[format]?.url;
	if (formatUrl) return `${base}${formatUrl}`;

	if (image.url) return `${base}${image.url}`;

	return null;
}
