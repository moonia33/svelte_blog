<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { data, children } = $props();
</script>

<Header menu2={data.menu2 || []} />
<main class="mx-auto max-w-7xl bg-white pb-8 dark:bg-gray-900">
	{@render children()}
</main>
<Footer />
