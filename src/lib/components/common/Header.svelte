<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		PUBLIC_PATREON_URL,
		PUBLIC_FACEBOOK_URL,
		PUBLIC_SITE_TITLE,
		PUBLIC_GITHUB_LINK
	} from '$env/static/public';
	import { HeartHandshake, Facebook, Menu, Github } from '@lucide/svelte';
	import { isChristmasSeason } from '$lib/utils/helpers';

	let {
		right,
		left,
		center,
		showSocialLinks = false,
		showMenu = false,
		fullWidth = false
	}: {
		right?: Snippet;
		left?: Snippet;
		center?: Snippet;
		showSocialLinks?: boolean;
		showMenu?: boolean;
		fullWidth?: boolean;
	} = $props();

	let menuOpen = $state(false);
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	function closeMenu() {
		menuOpen = false;
	}
</script>

<header
	class="top-0 z-10 bg-base-300/80 backdrop-blur-md border-b border-base-content/10 shadow-md"
>
	<div class:container={!fullWidth} class:mx-auto={!fullWidth} class:lg:px-4={fullWidth}>
		<div class="navbar">
			<div class="navbar-start">
				{#if left}
					{@render left()}
				{:else}
					<a href="/" class="flex items-center gap-2 text-xl font-medium">
						<span>{PUBLIC_SITE_TITLE}{isChristmasSeason() ? '🎄' : ''}</span>
					</a>
				{/if}
			</div>
			<div class="navbar-center hidden lg:flex">
				{#if showSocialLinks}
					<ul class="flex gap-4 items-center">
						<li>
							<a
								href={PUBLIC_PATREON_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors text-base font-medium"
							>
								<HeartHandshake size={18} class="text-primary" />
								Patreon
							</a>
						</li>
						<li>
							<a
								href={PUBLIC_FACEBOOK_URL}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors text-base font-medium"
							>
								<Facebook size={18} class="text-blue-600" />
								Facebook
							</a>
						</li>
						<li>
							<a
								href={PUBLIC_GITHUB_LINK}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors text-base font-medium"
							>
								<Github size={18} class="text-primary" />
								GitHub
							</a>
						</li>
					</ul>
				{:else if center}
					{@render center()}
				{/if}
			</div>
			<div class="navbar-end">
				{#if showMenu}
					<div class="relative md:hidden">
						<button
							class="btn btn-ghost btn-circle"
							onclick={toggleMenu}
							aria-label={menuOpen ? 'Lukk meny' : 'Åpne meny'}
						>
							<Menu size={24} />
						</button>
						{#if menuOpen}
							<ul
								class="absolute right-0 mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 menu menu-sm dropdown-content"
								onmouseleave={closeMenu}
							>
								<li>
									<a href="/products" onclick={closeMenu}>Produkter</a>
								</li>
								<li>
									<a
										href={PUBLIC_PATREON_URL}
										target="_blank"
										rel="noopener noreferrer"
										onclick={closeMenu}
									>
										Patreon
									</a>
								</li>
								<li>
									<a
										href={PUBLIC_FACEBOOK_URL}
										target="_blank"
										rel="noopener noreferrer"
										onclick={closeMenu}
									>
										Facebook
									</a>
								</li>
								<li>
									<a
										href={PUBLIC_GITHUB_LINK}
										target="_blank"
										rel="noopener noreferrer"
										onclick={closeMenu}
									>
										GitHub
									</a>
								</li>
							</ul>
						{/if}
					</div>
				{/if}
				{#if right}
					{@render right()}
				{/if}
			</div>
		</div>
	</div>
</header>
