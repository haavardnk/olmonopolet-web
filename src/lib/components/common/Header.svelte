<script lang="ts">
	import { HeartHandshake, Facebook, Menu } from '@lucide/svelte';
	import { PUBLIC_PATREON_URL, PUBLIC_FACEBOOK_URL, PUBLIC_SITE_TITLE } from '$env/static/public';

	export let right = null;
	export let left = null;
	export let showSocialLinks = false;
	export let showMenu = false;

	let menuOpen = false;
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
	<div class="container mx-auto">
		<div class="navbar">
			<div class="navbar-start">
				{#if left}
					<slot name="left">{left}</slot>
				{:else}
					<a href="/" class="flex items-center gap-2 text-xl font-medium">
						<span>{PUBLIC_SITE_TITLE}</span>
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
								Støtt oss
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
					</ul>
				{:else}
					<slot name="center" />
				{/if}
			</div>
			<div class="navbar-end">
				{#if showMenu}
					<div class="relative md:hidden">
						<button class="btn btn-ghost btn-circle" on:click={toggleMenu} aria-label="Åpne meny">
							<Menu size={24} />
						</button>
						{#if menuOpen}
							<ul
								class="absolute right-0 mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 menu menu-sm dropdown-content"
								on:mouseleave={closeMenu}
							>
								<li>
									<a
										href="https://patreon.com"
										target="_blank"
										rel="noopener noreferrer"
										on:click={closeMenu}
									>
										Patreon
									</a>
								</li>
								<li>
									<a
										href="https://facebook.com"
										target="_blank"
										rel="noopener noreferrer"
										on:click={closeMenu}
									>
										Facebook
									</a>
								</li>
							</ul>
						{/if}
					</div>
				{/if}
				<slot name="right"
					>{#if right}{right}{/if}</slot
				>
			</div>
		</div>
	</div>
</header>
