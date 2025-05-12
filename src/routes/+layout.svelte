<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { PUBLIC_GTM_ID } from '$env/static/public';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { afterNavigate } from '$app/navigation';

	let { data, children } = $props();

	afterNavigate(() => {
		window.dataLayer?.push({
			event: 'page_view',
			page_path: window.location.pathname + window.location.search,
			page_location: window.location.href,
			page_title: document.title
		});
	});

	onMount(() => {
		if (!window.dataLayer) {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

			const gtmScript = document.createElement('script');
			gtmScript.async = true;
			gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${PUBLIC_GTM_ID}`;
			document.head.appendChild(gtmScript);
		}
	});
</script>

<svelte:head>
	<!-- GTM noscript fallback – būtinas SEO ir accessibility -->
	<noscript>
		<iframe
			src={`https://www.googletagmanager.com/ns.html?id=${PUBLIC_GTM_ID}`}
			height="0"
			width="0"
			style="display:none;visibility:hidden"
			title="Google Tag Manager"
		></iframe>
	</noscript>
</svelte:head>
<Header menu2={data.menu2 || []} />
<main class="mx-auto max-w-7xl bg-white pb-8 dark:bg-gray-900">
	{@render children()}
</main>
<Footer />
