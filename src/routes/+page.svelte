<script lang="ts">
	import Faq from '$lib/components/Faq.svelte';
	export let data;
</script>

<!-- <Header menu2={data.menu2} /> -->

<div class="container mx-auto px-10 py-6">
	<div class="flex flex-col items-center justify-center">
		<h1 class="mb-4 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
			Teisinė Info
		</h1>
		<p class="mb-6 text-lg text-gray-500 dark:text-gray-400">Šeimos teisės teisiniai straipsniai</p>
	</div>
	<div class="mb-8">
		<h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Naujausi straipsniai</h2>
		<Faq articles={data.articles} />
	</div>
</div>
