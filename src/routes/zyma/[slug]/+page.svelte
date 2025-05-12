<script lang="ts">
	import type { Article, Tag } from '$lib/types/article';
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Timeline from '$lib/components/Timeline.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { PUBLIC_LOGO_URL } from '$env/static/public';
	// import { parseJsonLd } from '$lib/utils/escapeJsonLd';
	import { parseMarkdownWithClasses } from '$lib/utils/markedConfig';

	let { data } = $props();
	let articles: Article[] = $state([]);
	let tag: (Tag & { name: string }) | null = $state(null);
	let pageTitle = $state('Žyma');
	let pageDescription = $state('');
	let pageUrl = $state('');
	let processing = $state(false);
	const appUrl = PUBLIC_URL.replace(/\/$/, '');
	const logoUrl = PUBLIC_LOGO_URL.replace(/\/+$/, '');

	async function processArticle(article: Article): Promise<Article> {
		if (!article.Tekstas) return { ...article, TekstasHtml: '' };
		try {
			const html = await parseMarkdownWithClasses(article.Tekstas);
			return { ...article, TekstasHtml: html };
		} catch (e) {
			return {
				...article,
				TekstasHtml: typeof article.Tekstas === 'string' ? article.Tekstas : ''
			};
		}
	}

	$effect(() => {
		if (data?.tag) {
			tag = data.tag;
			const tagName = data.tag.name || data.tag.zyma || data.tag.zymas || data.tag.zymo || 'Žyma';
			pageTitle = `${tagName} | Teisinė Info`;
			pageDescription = `Straipsniai su žyma "${tagName}"`;
			pageUrl = `${appUrl}/zyma/${data.tag.slug}`;
		} else {
			tag = null;
			pageTitle = 'Žyma | Teisinė Info';
			pageDescription = 'Straipsniai pagal žymą';
			pageUrl = `${appUrl}/zyma`;
		}

		if (data?.articles && Array.isArray(data.articles)) {
			processing = true;
			Promise.all(data.articles.map(processArticle))
				.then((processedArticles) => {
					articles = processedArticles;
				})
				.catch((err) => {
					console.error('Klaida apdorojant straipsnius pagal žymą:', err);
					articles = data.articles; // Grąžiname neapdorotus, jei įvyko klaida
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
		name: `${data.tag.name}`,
		description: `${data.tag.name}`,
		url: `${appUrl}/zyma/${data.tag.slug}`,

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
	<Breadcrumb {tag} article={null} />
	<div>
		<h1 class="my-6 text-3xl font-bold">
			{tag?.name || tag?.zyma || tag?.zymas || tag?.zymo || 'Žyma'}
		</h1>

		{#if processing}
			<p class="text-gray-600 dark:text-gray-400">Kraunama...</p>
		{:else if articles.length > 0}
			<h2 class="mb-12 mt-8 text-xl font-semibold">
				Straipsniai su žyma "{tag?.name || tag?.zyma || tag?.zymas || tag?.zymo || 'Žyma'}"
			</h2>
			<Timeline {articles} />
			{#if data.pagination && data.pagination.pageCount > 1}
				<Pagination
					currentPage={data.pagination.page}
					pageCount={data.pagination.pageCount}
					baseUrl={`/zyma/${data.slug || tag?.slug || ''}`}
				/>
			{/if}
		{:else}
			<p class="my-8 text-gray-600 dark:text-gray-400">Šiuo metu nėra straipsnių su šia žyma.</p>
		{/if}
	</div>
</div>
