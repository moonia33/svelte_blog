<script lang="ts">
	import { escapeJsonLd } from '$lib/utils/escapeJsonLd';
	import Timeline from '$lib/components/Timeline.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	const base = PUBLIC_URL.replace(/\/+$/, '');
	export let data;
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: data.pavadinimas,
		description: data.seo.description,
		url: base,
		mainEntity: {
			'@type': 'CollectionPage',
			name: 'Naujausi straipsniai',
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: data.articles.map((a, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'BlogPosting',
						headline: a.Title,
						description: a.IlgasPavadinimas || '',
						url: `${base}/straipsnis/${a.slug}`,
						datePublished: a.Data,
						image: a.Image || undefined
					}
				}))
			}
		}
	};
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	<link rel="canonical" href={PUBLIC_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.seo.title} />
	<meta property="og:description" content={data.seo.description} />
	<meta property="og:url" content="https://teisine.info" />
	{@html `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(structuredData))}</script>`}
</svelte:head>
<div class="container mx-auto px-3 py-6 md:px-10">
	<div class="flex flex-col items-center justify-center pb-10">
		<h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
			{data.pavadinimas}
		</h1>
		{@html data.descriptionHtml}
	</div>
	<Timeline articles={data.articles} />
</div>
