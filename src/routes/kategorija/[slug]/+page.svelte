<script lang="ts">
	import type { Article, Category } from '$lib/types/article';
	import Faq from '$lib/components/Faq.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

	let { data } = $props();
	let articles: Article[] = $state([]);
	let category: Category | null = $state(null);
	let pageTitle = $state('Kategorija');
	let pageDescription = $state('');
	let pageUrl = $state('');
	let processing = $state(false);
	const appUrl = PUBLIC_URL.replace(/\/$/, '');
	async function processArticle(article: Article): Promise<Article> {
		if (!article.Tekstas) return { ...article, TekstasHtml: '' };

		try {
			console.log(`Apdorojame straipsnį ${article.Title}, Tekstas tipas:`, typeof article.Tekstas);

			const html = await parseMarkdownWithClasses(article.Tekstas);

			// Patikrinkime, ar rezultate yra sąrašo elementai
			const hasListItems = html.includes('<ul') || html.includes('<ol');
			console.log(`Straipsnis ${article.Title} - ar turi sąrašus:`, hasListItems);

			return { ...article, TekstasHtml: html };
		} catch (e) {
			console.error('Klaida apdorojant straipsnio tekstą:', e);
			return {
				...article,
				TekstasHtml: typeof article.Tekstas === 'string' ? article.Tekstas : ''
			};
		}
	}
	$effect(() => {
		// Nustatome kategorijos informaciją
		if (data?.category) {
			category = data.category;
			pageTitle = `${data.category.name} | Teisinė Info`;
			pageDescription =
				data.category.description || `Straipsniai kategorijoje ${data.category.name}`;
			pageUrl = `${appUrl}/kategorija/${data.category.slug}`;
		} else {
			category = null;
			pageTitle = 'Kategorija | Teisinė Info';
			pageDescription = 'Straipsnių kategorija';
			pageUrl = `${appUrl}/kategorija`;
		}

		// Apdorojame straipsnius
		if (data?.articles && Array.isArray(data.articles)) {
			processing = true;
			Promise.all(data.articles.map(processArticle))
				.then((processedArticles) => {
					articles = processedArticles;
				})
				.catch((err) => {
					console.error('Error processing articles:', err);
					articles = data.articles;
				})
				.finally(() => {
					processing = false;
				});
		} else {
			articles = [];
			processing = false;
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={pageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
</svelte:head>

<div class="container mx-auto">
	<Breadcrumb {category} article={null} />
	<div class="px-4">
		<h1 class="my-6 text-3xl font-bold">{category?.name ?? 'Kategorija'}</h1>
		{#if pageDescription}
			<p>{pageDescription}</p>
		{/if}
		{#if processing}
			<p class="text-gray-600 dark:text-gray-400">Kraunama...</p>
		{:else if articles.length > 0}
			<h2 class="mb-3 mt-4 text-xl font-semibold">
				Straipsniai kategorijoje {category?.name ?? 'Kategorija'}
			</h2>
			<Faq {articles} />
		{:else}
			<p class="text-gray-600 dark:text-gray-400">Šioje kategorijoje straipsnių nėra.</p>
		{/if}
	</div>
	{#if data?.pagination}
		<Pagination
			currentPage={data.pagination.page}
			pageCount={data.pagination.pageCount}
			baseUrl="/kategorija"
			slug={data.category.slug}
		/>
	{/if}
</div>
