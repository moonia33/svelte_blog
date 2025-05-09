<script lang="ts">
	import { marked } from 'marked';
	import type { Article, Category } from '$lib/types/article';
	import Faq from '$lib/components/Faq.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	let articles: Article[] = $state([]);
	let category: Category | null = $state(null);
	let pageTitle = $state('Kategorija');
	let pageDescription = $state('');
	let pageUrl = $state('');
	let processing = $state(false);

	async function processArticle(article: Article): Promise<Article> {
		if (!article.Tekstas) return { ...article, TekstasHtml: '' };

		const html = await marked.parse(article.Tekstas);
		return { ...article, TekstasHtml: html };
	}
	$effect(() => {
		// Nustatome kategorijos informaciją
		if (data?.category) {
			category = data.category;
			pageTitle = `${data.category.name} | Teisinė Info`;
			pageDescription =
				data.category.description || `Straipsniai kategorijoje ${data.category.name}`;
			pageUrl = `https://teisine.info/kategorija/${data.category.slug}`;
		} else {
			category = null;
			pageTitle = 'Kategorija | Teisinė Info';
			pageDescription = 'Straipsnių kategorija';
			pageUrl = 'https://teisine.info/kategorija';
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
		{#if processing}
			<p class="text-gray-600 dark:text-gray-400">Kraunama...</p>
		{:else if articles.length > 0}
			<Faq {articles} />
		{:else}
			<p class="text-gray-600 dark:text-gray-400">Šioje kategorijoje straipsnių nėra.</p>
		{/if}
	</div>
</div>
