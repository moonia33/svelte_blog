<script lang="ts">
	import type { Tag } from '$lib/types/article';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { PUBLIC_URL } from '$env/static/public';
	import { Badge } from 'flowbite-svelte';

	let { data } = $props();
	let tags: Array<Tag & { name: string }> = $state([]);
	let pageTitle = $state('Žymos | Teisinė Info');
	let pageDescription = $state('Visos teisinės žymos');
	let pageUrl = $state('');
	const appUrl = PUBLIC_URL.replace(/\/$/, '');

	$effect(() => {
		pageTitle = data.meta?.title || 'Žymos | Teisinė Info';
		pageDescription = data.meta?.description || 'Visos teisinės informacijos žymos';
		pageUrl = `${appUrl}/zyma`;

		if (data?.tags && Array.isArray(data.tags)) {
			tags = data.tags.map((tag) => {
				// API grąžina { id, zyma, zymas, zymo, slug, ... }
				const tagName = tag.zyma || tag.zymas || tag.zymo || 'Nežinoma žyma';

				return {
					id: tag.id,
					slug: tag.slug,
					zyma: tag.zyma,
					zymas: tag.zymas,
					zymo: tag.zymo,
					name: tagName
				};
			});
		} else {
			tags = [];
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
	<Breadcrumb tag={null} basePage={{ name: 'Žymos', slug: 'zyma' }} article={null} />

	<div class="px-10">
		<h1 class="my-6 text-2xl font-bold">Žymos</h1>
		<p class="mb-6">Pasirinkite žymą, kad pamatytumėte susijusius straipsnius:</p>

		{#if tags.length > 0}
			<!-- <div class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"> -->
			{#each tags as tag}
				<Badge class="mr-2" href={`/zyma/${tag.slug}`} large color="green">{tag.name}</Badge>
				<!-- <a
						href={`/zyma/${tag.slug}`}
						class="my-2 block rounded-lg border border-gray-200 bg-white px-1 pl-2 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
					>
						<h2 class="my-1 border-0 py-1 text-sm font-semibold text-gray-900 dark:text-white">
							{tag.name}
						</h2>
					</a> -->
			{/each}
			<!-- </div> -->
		{:else}
			<p class="text-gray-600 dark:text-gray-400">Šiuo metu nėra jokių žymų.</p>
		{/if}
	</div>
</div>
