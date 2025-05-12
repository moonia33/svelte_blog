<script lang="ts">
	import type { Article } from '$lib/types/article';
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Timeline from '$lib/components/Timeline.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { PUBLIC_LOGO_URL } from '$env/static/public';
	import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

	const base = PUBLIC_URL.replace(/\/+$/, '');
	const logoUrl = PUBLIC_LOGO_URL;
	const url = `${base}/kategorija`;

	let { data } = $props();
	let articles: Article[] = $state([]);
	let pageTitle = $state('Visi straipsniai | Teisinė Info');
	let pageDescription = $state('Visi teisiniai straipsniai ir informacija');
	let pageUrl = $state('');
	let processing = $state(false);
	const appUrl = PUBLIC_URL.replace(/\/$/, '');
	async function processArticle(article: Article): Promise<Article> {
		if (!article.Tekstas) return { ...article, TekstasHtml: '' };

		try {
			const html = await parseMarkdownWithClasses(article.Tekstas);
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
		// Nustatome puslapio meta informaciją
		pageTitle = 'Visi straipsniai | Teisinė Info';
		pageDescription = 'Visi teisiniai straipsniai ir informacija';
		pageUrl = `${appUrl}/kategorija`;

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

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Visi straipsniai',
		description: 'Visi teisiniai straipsniai ir informacija',
		url,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: data.articles.map((a: Article, index: number) => ({
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'BlogPosting',
					headline: a.Title,
					description: a.IlgasPavadinimas || '',
					url: `${base}/straipsnis/${a.slug}`,
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
	<Breadcrumb
		category={null}
		basePage={{ name: 'Visos kategorijos', slug: 'kategorija' }}
		article={null}
	/>

	<div>
		<h1 class="my-6 text-3xl font-bold">Visi straipsniai</h1>
		<p>{pageDescription}</p>

		{#if processing}
			<p class="text-gray-600 dark:text-gray-400">Kraunama...</p>
		{:else if articles.length > 0}
			<!-- <Faq {articles} /> -->
			<Timeline {articles} />
		{:else}
			<p class="text-gray-600 dark:text-gray-400">Straipsnių nėra.</p>
		{/if}
	</div>

	{#if data?.pagination}
		<div class="mt-4">
			<Pagination
				currentPage={data.pagination.page}
				pageCount={data.pagination.pageCount}
				baseUrl="/kategorija"
				slug=""
			/>
		</div>
	{/if}
</div>
