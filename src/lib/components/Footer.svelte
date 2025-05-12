<script>
	import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer footerType="socialmedia" class="bg-slate-200 dark:bg-slate-950">
	<div class="mx-auto max-w-screen-xl text-center">
		<p class="my-6 text-gray-600 dark:text-gray-300">
			Projektas susidūrusiems su teisinėm problemom, siekiant padėti jiems rasti atsakymus į
			klausimus, susijusius su teisine informacija. Teisinė Info
		</p>
		<FooterLinkGroup
			class="mb-6 flex flex-wrap items-center justify-center text-gray-900 dark:text-white"
		>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/taisykles">Taisyklės</FooterLink>
			<FooterLink aClass="mr-4 hover:underline md:mr-6" href="/slapukai"
				>Privatumas ir Slapukai</FooterLink
			>
		</FooterLinkGroup>
		<span class="text-sm text-gray-700 sm:text-center dark:text-gray-200"
			>© 2011-2025 <a
				href="https://teisine-konsultacija.lt/"
				target="_blank"
				class="hover:underline">Teisinė Konsultacija™</a
			>. Visos teisės saugomos.</span
		>
	</div>
</Footer>
