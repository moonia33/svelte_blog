<script lang="ts">
	export let menu2: { name: string; slug: string; help?: string }[] = [];

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		MegaMenu,
		DarkMode
	} from 'flowbite-svelte';

	import { ChevronDownOutline } from 'flowbite-svelte-icons';
</script>

<Navbar color="slate" class="bg-slate-200 dark:bg-slate-950">
	<NavBrand href="/">Teisinė Info</NavBrand>
	<NavHamburger />
	<NavUl ulClass="text-lg font-medium md:text-lg">
		<NavLi href="/">Pagrindinis</NavLi>
		{#if menu2?.length}
			<NavLi
				role="button"
				type="button"
				aria-haspopup="true"
				aria-expanded="false"
				aria-controls="mega-menu"
			>
				Kategorijos
				<ChevronDownOutline class="ms-2 inline h-6 w-6" />
			</NavLi>
			<MegaMenu
				items={menu2}
				id="mega-menu"
				class="bg-slate-100 dark:bg-slate-800"
				aria-label="Kategorijų navigacija"
			>
				{#snippet children({ item })}
					<a
						href={'/kategorija/' + item.slug}
						class="block rounded-lg p-3 hover:bg-slate-200 hover:text-orange-500 dark:hover:bg-gray-700"
					>
						<div class="text-base font-semibold">{item.name}</div>
						{#if item.help}
							<span class="text-sm text-gray-500">{item.help}</span>
						{/if}
					</a>
				{/snippet}
			</MegaMenu>
		{/if}
	</NavUl>
	<DarkMode
		aria-label="Tamsus kontrastas"
		class="text-primary-500 dark:text-primary-600 mx-3 border dark:border-gray-800"
	/>
</Navbar>
