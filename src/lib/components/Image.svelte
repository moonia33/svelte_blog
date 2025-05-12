<script lang="ts">
	import type { ArticleImage } from '$lib/types/article';
	import { resolveImageUrl } from '$lib/utils/resolveImage';

	let {
		image,
		format = 'large',
		fallbackAlt = 'Paveikslėlis'
	} = $props<{
		image?: ArticleImage | null;
		format?: 'thumbnail' | 'small' | 'medium' | 'large';
		fallbackAlt?: string;
	}>();

	const url = resolveImageUrl(image, format);
	const alt = image?.alternativeText || image?.caption || fallbackAlt;
	const width = image?.formats?.[format]?.width ?? image?.width;
	const height = image?.formats?.[format]?.height ?? image?.height;
</script>

{#if url}
	<figure
		style={`max-width: ${width}px`}
		class="border-1 mx-auto mb-10 inline-block rounded-2xl border-stone-400 p-4 dark:border-stone-600"
	>
		<img class="rounded-4xl mt-0 border-0" src={url} {alt} {width} {height} loading="lazy" />

		{#if image?.caption}
			<figcaption class="mt-2 text-center text-sm italic text-gray-500">
				{image.caption}
			</figcaption>
		{/if}
	</figure>
{:else}
	<!-- fallback -->
	<span class="image-placeholder">🖼️</span>
{/if}
