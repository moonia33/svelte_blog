<script lang="ts">
	import type { Article, Category } from '$lib/types/article';
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Timeline from '$lib/components/Timeline.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { PUBLIC_LOGO_URL } from '$env/static/public';
	import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

	let { data } = $props();
	let articles: Article[] = $state([]);
	let category: Category | null = $state(null);
	let pageTitle = $state('Kategorija');
	let pageDescription = $state('');
	let pageUrl = $state('');
	let processing = $state(false);
	const appUrl = PUBLIC_URL.replace(/\/$/, '');
	const logoUrl = PUBLIC_LOGO_URL;
	async function processArticle(article: Article): Promise<Article> {
		if (!article.Tekstas) return { ...article, TekstasHtml: '' };

		try {
			const html = await parseMarkdownWithClasses(article.Tekstas);

			// Patikrinkime, ar rezultate yra sąrašo elementai
			const hasListItems = html.includes('<ul') || html.includes('<ol');

			return { ...article, TekstasHtml: html };
		} catch (e) {
			return {
				...article,
				TekstasHtml: typeof article.Tekstas === 'string' ? article.Tekstas : ''
			};
		}
	}
	$effect(() => {
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

		if (data?.articles && Array.isArray(data.articles)) {
			processing = true;
			Promise.all(data.articles.map(processArticle))
				.then((processedArticles) => {
					articles = processedArticles;
				})
				.catch((err) => {
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
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: `${data.category.name}`,
		description: `${data.category.description}`,
		url: `${appUrl}/kategorija/${data.category.slug}`,

		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data.articles.map((a: Article, index: number) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'BlogPosting',
					headline: a.Title,
					description: a.IlgasPavadinimas || '',
					url: `${appUrl}/straipsnis/${a.slug}`,
					datePublished: a.Data,
					image: a.Image || `${logoUrl}`
				}
			}))
		}
	};
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

	{@html `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(structuredData))}</script>`}
</svelte:head>

<div class="container mx-auto px-3 py-12 md:px-10">
	<Breadcrumb {category} article={null} />
	<div>
		<h1 class="my-6 text-3xl font-bold">{category?.name ?? 'Kategorija'}</h1>
		{#if pageDescription}
			<p>{pageDescription}</p>
		{/if}
		{#if processing}
			<p class="text-gray-600 dark:text-gray-400">Kraunama...</p>
		{:else if articles.length > 0}
			<h2 class="mb-12 mt-8 text-xl font-semibold">
				Straipsniai kategorijoje {category?.name ?? 'Kategorija'}
			</h2>

			<Timeline {articles} />
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
