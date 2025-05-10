<script lang="ts">
	import { Faq, FaqItem } from 'flowbite-svelte-blocks';
	import type { Article } from '$lib/types/article';

	export let articles: Article[] = [];

	const left = articles.filter((_, i) => i % 2 === 0);
	const right = articles.filter((_, i) => i % 2 !== 0);

	function getPreviewText(text?: string): string {
		if (!text) return '';
		return text.slice(0, 300) + (text.length > 300 ? '…' : '');
	}
</script>

<Faq class="grid grid-cols-1 gap-8 md:grid-cols-2">
	{#each [left, right] as column}
		<div class="space-y-6">
			{#each column as article (article.slug)}
				<FaqItem>
					{#snippet h3()}
						<a href={`/straipsnis/${article.slug}`} class="hover:underline">
							{article.IlgasPavadinimas || article.Title}
						</a>
					{/snippet}
					<p class="mb-2 text-sm text-gray-600 dark:text-gray-300">
						{new Date(article.Data).toLocaleDateString('lt-LT')}
					</p>
					<p class="line-clamp-4 text-gray-700 dark:text-gray-300">
						{@html getPreviewText(article.IlgasPavadinimas)}
						<!-- {@html article.TekstasHtml} -->
					</p>
				</FaqItem>
			{/each}
		</div>
	{/each}
</Faq>
