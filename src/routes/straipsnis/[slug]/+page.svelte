<script lang="ts">
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	export let data;
	const { article } = data;
	const title = article.Seo?.[0]?.metaTitle ?? article.Title;
	const description = article.Seo?.[0]?.metaDescription ?? '';
	const url = `https://teisine.info/straipsnis/${article.slug}`;
	const image = article.Image;

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		datePublished: article.Data,
		image,
		url
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	{#if image}
		<meta property="og:image" content={image} />
		<meta name="twitter:image" content={image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />

	{@html `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(structuredData))}</script>`}
</svelte:head>

<Breadcrumb category={article.categories[0]} {article} />

<article class="prose dark:prose-invert mx-auto max-w-7xl px-8 py-12">
	{#if article.Image}
		<img
			src={article.Image}
			alt={article.Seo?.[0]?.metaTitle ?? article.Title}
			class="mb-8 rounded-lg shadow"
			loading="lazy"
		/>
	{/if}

	<h1 class="mb-2 text-3xl font-bold">{article.Title}</h1>
	<blockquote>
		{article.IlgasPavadinimas}
	</blockquote>
	<p class="mb-6 text-sm text-gray-500">
		Publikuota: {new Date(article.Data).toLocaleDateString('lt-LT')}
	</p>

	{@html article.TekstasHtml}

	<!-- Kategorijos -->
	{#if article.categories?.length}
		<div class="mt-10 text-sm text-gray-700 dark:text-gray-300">
			<strong>Kategorijos:</strong>
			{#each article.categories as cat, i (cat.id)}
				<a href={`/kategorija/${cat.slug}`} class="text-primary-600 underline hover:no-underline"
					>{cat.name}</a
				>{i < article.categories.length - 1 ? ', ' : ''}
			{/each}
		</div>
	{/if}

	<!-- Žymos -->
	{#if article.tags?.length}
		<div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
			<strong>Žymos:</strong>
			{#each article.tags as tag, i (tag.id)}
				<a href={`/zyma/${tag.slug}`} class="text-primary-600 underline hover:no-underline"
					>{tag.zyma ?? tag.zymas ?? tag.zymo ?? 'Unknown'}</a
				>{i < article.tags.length - 1 ? ', ' : ''}
			{/each}
		</div>
	{/if}
</article>
