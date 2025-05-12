<script lang="ts">
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { ArrowRightAltOutline } from 'flowbite-svelte-icons';
	import Image from '$lib/components/Image.svelte';
	import { Badge } from 'flowbite-svelte';
	import { Span } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { PUBLIC_LOGO_URL } from '$env/static/public';

	const base = PUBLIC_URL.replace(/\/+$/, '');
	const logoUrl = PUBLIC_LOGO_URL.replace(/\/+$/, '');

	export let data;
	const { article } = data;

	const title = article.Seo?.metaTitle ?? article.Title;
	const description = article.Seo?.metaDescription ?? '';
	const url = `${base}/straipsnis/${article.slug}`;
	const image = article.Image;

	const keywords = article.tags?.map((tag) => tag.zyma ?? tag.zymas ?? tag.zymo).filter(Boolean);

	const articleSection = article.categories?.map((cat) => cat.name).filter(Boolean);
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished: article.Data,
		dateModified: article.updatedAt,
		url,
		image: article.Image || `${logoUrl}`,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		publisher: {
			'@type': 'Organization',
			name: 'Teisinė informacija',
			logo: {
				'@type': 'ImageObject',
				url: `${logoUrl}`
			}
		},
		author: {
			'@type': 'Organization',
			name: 'Teisinė informacija'
		},
		keywords: keywords?.join(', ') || undefined,
		articleSection: articleSection?.join(', ') || undefined
	};

	// ✅ UTM + GTM event trackinimas
	onMount(() => {
		const hostname = window.location.hostname;
		const campaign = encodeURIComponent(article.slug);
		const utm = `utm_source=teisine.info&utm_medium=referral&utm_campaign=${campaign}`;

		const container = document.querySelector('[data-article-content]');
		if (!container) return;

		container.querySelectorAll('a[href^="http"]').forEach((link) => {
			const a = link as HTMLAnchorElement;
			try {
				const url = new URL(a.href);
				if (url.hostname !== hostname && !url.search.includes('utm_')) {
					url.search += (url.search ? '&' : '') + utm;
					a.href = url.toString();
				}

				// Ne sekame tel/mailto/internal
				if (!url.href.startsWith('http')) return;

				a.addEventListener('click', () => {
					window.dataLayer?.push({
						event: 'outbound_click',
						url: a.href,
						campaign,
						title: article.Title
					});
				});
			} catch {
				console.warn('Bloga nuoroda:', a.href);
			}
		});
	});
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

<article class="prose dark:prose-invert mx-auto max-w-7xl px-8 py-12" data-article-content>
	{#if article.Nuotrauka}
		<Image image={article.Nuotrauka} format="thumbnail" fallbackAlt={article.Title} />
	{/if}

	<h1 class="mb-2 text-3xl font-bold">{article.Title}</h1>
	<h2 class="my-0 mb-4 ml-0 flex border-0 py-0 pl-0 text-base font-semibold">
		<Span class="pr-1"><ArrowRightAltOutline /></Span>{article.IlgasPavadinimas}
	</h2>
	<p class="mb-6 text-sm text-gray-500">
		Publikuota: {new Date(article.Data).toLocaleDateString('lt-LT')}
	</p>

	{@html article.TekstasHtml}

	{#if article.categories?.length}
		<div class="mt-10 text-sm text-gray-700 dark:text-gray-300">
			<strong>Kategorijos:</strong>
			{#each article.categories as cat, i (cat.id)}
				<Badge href={`/kategorija/${cat.slug}`} large color="indigo" class="my-1">{cat.name}</Badge>
				{i < article.categories.length - 1 ? ' ' : ''}
			{/each}
		</div>
	{/if}

	{#if article.tags?.length}
		<div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
			<strong>Žymos:</strong>
			{#each article.tags as tag, i (tag.id)}
				<Badge href={`/zyma/${tag.slug}`} large color="green" class="my-1">
					{tag.zyma ?? tag.zymas ?? tag.zymo ?? 'Unknown'}
				</Badge>
				{i < article.tags.length - 1 ? ' ' : ''}
			{/each}
		</div>
	{/if}
</article>
