<script lang="ts">
	export let data: {
		title: string;
		descriptionHtml: string;
	};

	// Įsitikiname, kad yra bent kažkoks turinys
	const hasContent = data.descriptionHtml && data.descriptionHtml.length > 0;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<article class="prose dark:prose-invert mx-auto max-w-4xl px-3 py-12 md:px-10">
	<h1 class="mb-4 text-2xl font-bold">{data.title}</h1>

	{#if hasContent}
		{@html data.descriptionHtml}
	{:else}
		<p>Informacija ruošiama...</p>
	{/if}
</article>
