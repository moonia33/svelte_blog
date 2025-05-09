<script>
	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer footerType="socialmedia" class="bg-slate-200 dark:bg-slate-950">
	<div class="mx-auto max-w-screen-xl text-center">
		<p class="my-6 text-gray-500 dark:text-gray-400">
			Open-source library of over 400+ web components and interactive elements built for better web.
		</p>
		<FooterLinkGroup
			class="mb-6 flex flex-wrap items-center justify-center text-gray-900 dark:text-white"
		>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">About</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">Premium</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">Campaigns</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">Blog</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">Affiliate Program</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">FAQs</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/">Contact</FooterLink>
		</FooterLinkGroup>
		<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
			>© 2011-2025 <a href="https://teisine-konsultacija.lt/" class="hover:underline"
				>Teisinė Konsultacija™</a
			>. Visos teisės saugomos.</span
		>
	</div>
</Footer>
