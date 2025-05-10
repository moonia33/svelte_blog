<script lang="ts">
	import { Pagination } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { currentPage = 1, pageCount = 1, baseUrl = '', slug = '' } = $props();

	// Sukuriame puslapių masyvą
	$effect(() => {
		generatePages();
	});

	let pages = $state<Array<{ name: string; href: string; active: boolean }>>([]);

	// Generuojame puslapių masyvą
	function generatePages() {
		const newPages = [];
		const maxVisiblePages = 5; // Kiek daugiausiai puslapių rodome

		// Jei mažai puslapių, rodome visus
		if (pageCount <= maxVisiblePages) {
			for (let i = 1; i <= pageCount; i++) {
				newPages.push({
					name: i.toString(),
					href: `${baseUrl}/${slug}?page=${i}`,
					active: i === currentPage
				});
			}
		} else {
			// Rodome pirmus, paskutinius ir aplink dabartinį
			const leftSide = Math.floor(maxVisiblePages / 2);
			const rightSide = Math.ceil(maxVisiblePages / 2) - 1;

			// Pradedame nuo pirmo puslapio arba nuo dabartinio - leftSide
			let start = Math.max(1, currentPage - leftSide);
			// Baigiame paskutiniu puslapiu arba dabartinis + rightSide
			let end = Math.min(pageCount, start + maxVisiblePages - 1);

			// Jei end pasiekė pabaigą, pakoreguojame start
			if (end === pageCount) {
				start = Math.max(1, end - maxVisiblePages + 1);
			} // Pridedame pirmus puslapius
			for (let i = start; i <= end; i++) {
				newPages.push({
					name: i.toString(),
					href: slug ? `${baseUrl}/${slug}?page=${i}` : `${baseUrl}?page=${i}`,
					active: i === currentPage
				});
			}
		}

		pages = newPages;
	}
	// Mygtukai pirmyn/atgal
	function previous() {
		if (currentPage > 1) {
			const url = slug
				? `${baseUrl}/${slug}?page=${currentPage - 1}`
				: `${baseUrl}?page=${currentPage - 1}`;
			goto(url);
		}
	}

	function next() {
		if (currentPage < pageCount) {
			const url = slug
				? `${baseUrl}/${slug}?page=${currentPage + 1}`
				: `${baseUrl}?page=${currentPage + 1}`;
			goto(url);
		}
	}
</script>

<!-- Rodome tik jei yra daugiau nei 1 puslapis -->
{#if pageCount > 1}
	<div class="flex flex-col items-center justify-center gap-3 py-8">
		<div class="text-sm text-gray-700 dark:text-gray-400">
			<span class="font-semibold text-gray-900 dark:text-white">{currentPage}</span> iš
			<span class="font-semibold text-gray-900 dark:text-white">{pageCount}</span> puslapių
		</div>

		<Pagination {pages} {previous} {next}>
			{#snippet prevContent()}
				<span class="sr-only">Ankstesnis</span>
				<ChevronLeftOutline class="h-5 w-5" />
			{/snippet}
			{#snippet nextContent()}
				<span class="sr-only">Kitas</span>
				<ChevronRightOutline class="h-5 w-5" />
			{/snippet}
		</Pagination>
	</div>
{/if}
