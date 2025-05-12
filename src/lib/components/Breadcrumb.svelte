<script lang="ts">
	import { Breadcrumb as FlowbiteSvelteBreadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { HomeOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import type {
		Category as StrapiCategory,
		Article as StrapiArticle,
		Tag as StrapiTag
	} from '$lib/types/article';

	// Supaprastinti ir aiškesni prop tipai
	type CategoryProp = StrapiCategory | null;
	type TagProp = (Omit<StrapiTag, 'zyma' | 'zymas' | 'zymo'> & { name: string }) | null; // Tikimės, kad 'name' bus pridėtas serverio pusėje
	type ArticleProp = Pick<StrapiArticle, 'Title'> | null;
	type BasePageProp = { name: string; slug: string } | null;

	let {
		category,
		article,
		tag,
		basePage
	}: {
		category?: CategoryProp;
		article?: ArticleProp;
		tag?: TagProp;
		basePage?: BasePageProp;
	} = $props();
</script>

<FlowbiteSvelteBreadcrumb
	olClass="overflow-auto"
	aria-label="Navigacijos kelias"
	class="bg-gray-50 px-5 py-3 dark:bg-gray-900"
>
	<BreadcrumbItem href="/" home>
		{#snippet icon()}
			<HomeOutline class="me-2 h-4 w-4" />
		{/snippet}
		Pradžia
	</BreadcrumbItem>

	{#if basePage}
		<BreadcrumbItem href={`/${basePage.slug}`}>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			{basePage.name}
		</BreadcrumbItem>
	{/if}

	{#if category && !basePage}
		<BreadcrumbItem href={`/kategorija`}>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			Kategorija
		</BreadcrumbItem>
		<BreadcrumbItem href={`/kategorija/${category.slug}`}>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			{category.name}
		</BreadcrumbItem>
	{/if}

	{#if tag && !basePage}
		<BreadcrumbItem href={`/zyma`}>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			Žyma
		</BreadcrumbItem>
		<BreadcrumbItem href={`/zyma/${tag.slug}`}>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			{tag.name}
		</BreadcrumbItem>
	{/if}

	{#if article}
		<BreadcrumbItem>
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			{article.Title}
		</BreadcrumbItem>
	{/if}
</FlowbiteSvelteBreadcrumb>
