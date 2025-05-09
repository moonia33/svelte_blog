<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { HomeOutline, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	let { category, article } = $props();
</script>

<Breadcrumb aria-label="Navigacijos kelias" class="bg-gray-50 px-5 py-3 dark:bg-gray-900">
	<BreadcrumbItem href="/" home>
		{#snippet icon()}
			<HomeOutline class="me-2 h-4 w-4" />
		{/snippet}
		Pradžia
	</BreadcrumbItem>
	{#if category}
		<BreadcrumbItem href="/kategorija/{category.slug}">
			{#snippet icon()}
				<ChevronDoubleRightOutline class="mx-2 h-5 w-5 dark:text-white" />
			{/snippet}
			{category.name}
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
</Breadcrumb>
