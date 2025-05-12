<script lang="ts">
	import { Timeline, TimelineItem, Badge } from 'flowbite-svelte';
	import { FolderPlusOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils/dateFormatter';
	import type { Article } from '$lib/types/article';

	export let articles: Article[] = [];

	function getPreviewText(text?: string): string {
		if (!text) return '';
		return text.slice(0, 150) + (text.length > 150 ? '…' : '');
	}

	function formatArticleDate(dateString: string): string {
		try {
			return formatDate(new Date(dateString));
		} catch (e) {
			return '';
		}
	}
</script>

<Timeline order="horizontal" class="flex flex-wrap gap-10">
	{#each articles as article (article.slug)}
		<TimelineItem
			title={article.Title}
			date={new Date(article.Data).toLocaleDateString('lt-LT')}
			liClass="w-full md:w-[calc(50%-1.25rem)] mb-2 relative p-6 border-1 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-md"
			divClass="flex-1"
			timeClass="text-cyan-800 dark:text-cyan-300"
		>
			{#snippet orientationSlot()}
				<div class="flex items-center">
					<div
						class="bg-primary-200 dark:bg-primary-900 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-0 ring-white sm:ring-8 dark:ring-gray-900"
					>
						<FolderPlusOutline class="text-primary-600 dark:text-primary-400 h-4 w-4" />
					</div>
					<div class="hidden h-0.5 w-full bg-gray-200 sm:flex dark:bg-gray-700"></div>
				</div>
			{/snippet}
			<p class="mb-2 text-base font-normal text-gray-700 dark:text-gray-300">
				{article.IlgasPavadinimas}
			</p>

			<!-- Kategorijos -->
			{#if article.categories && article.categories.length > 0}
				{#each article.categories as cat, i (cat.id)}
					<Badge href={`/kategorija/${cat.slug}`} color="indigo" class="mb-1 mr-1">{cat.name}</Badge
					>
				{/each}
			{/if}

			<!-- Žymos -->
			{#if article.tags && article.tags.length > 0}
				{#each article.tags as tag, i (tag.id)}
					<Badge href={`/zyma/${tag.slug}`} color="green" class="mb-1 mr-1">
						{tag.zyma ?? tag.zymas ?? tag.zymo ?? 'Žyma'}
					</Badge>
				{/each}
			{/if}
			<div class="mt-2">
				<a
					href="/straipsnis/{article.slug}"
					class="text-primary-900 dark:text-primary-200 inline-flex items-center hover:text-cyan-700 dark:hover:text-cyan-300"
				>
					Skaityti daugiau
					<svg
						class="ml-1 h-5 w-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path>
					</svg>
				</a>
			</div>
		</TimelineItem>
	{/each}
</Timeline>
