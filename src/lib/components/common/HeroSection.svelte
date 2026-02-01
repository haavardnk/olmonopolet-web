<script lang="ts">
	import {
		PUBLIC_APP_STORE_URL,
		PUBLIC_GOOGLE_PLAY_URL,
		PUBLIC_CHROME_EXTENSION_URL,
		PUBLIC_SITE_TITLE,
		PUBLIC_SITE_DESCRIPTION
	} from '$env/static/public';
	import { fly } from 'svelte/transition';
	import { Play, Apple, Chromium, Beer } from '@lucide/svelte';
	import hero from '$lib/assets/hero.svg?raw';
	import heroWinter from '$lib/assets/hero-winter.svg?raw';
	import heroChristmas from '$lib/assets/hero-christmas.svg?raw';

	const currentMonth = new Date().getMonth() + 1;
	const heroImage =
		currentMonth === 12
			? heroChristmas
			: currentMonth >= 11 || currentMonth <= 2
				? heroWinter
				: hero;
</script>

<div class="hero py-12 bg-base-200">
	<div class="text-center">
		<div class="max-w-xl">
			<div
				class="relative flex items-center justify-center hero-image"
				in:fly={{ y: 20, duration: 300 }}
			>
				{@html heroImage}
			</div>

			<div in:fly={{ y: 20, duration: 300, delay: 100 }}>
				<h1 class="text-4xl font-bold mb-4">{PUBLIC_SITE_TITLE}</h1>
				<p class="text-lg opacity-80 mb-8">
					{PUBLIC_SITE_DESCRIPTION}
				</p>
			</div>

			<div
				class="flex flex-col sm:flex-row sm:flex-wrap gap-4 max-w-md sm:max-w-2xl mx-auto px-4"
				in:fly={{ y: 20, duration: 300, delay: 200 }}
			>
				<a
					href={PUBLIC_GOOGLE_PLAY_URL}
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group sm:flex-1"
				>
					<div class="flex items-center gap-2">
						<Play size={24} class="text-primary group-hover:text-primary-content" />
						<div class="flex flex-col items-start">
							<span class="text-xs opacity-80">LAST NED FRA</span>
							<span class="font-bold text-sm">Google Play</span>
						</div>
					</div>
				</a>

				<a
					href={PUBLIC_APP_STORE_URL}
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group sm:flex-1"
				>
					<div class="flex items-center gap-2">
						<Apple size={24} class="text-primary group-hover:text-primary-content" />
						<div class="flex flex-col items-start">
							<span class="text-xs opacity-80">LAST NED FRA</span>
							<span class="font-bold text-sm">App Store</span>
						</div>
					</div>
				</a>

				<a
					href={PUBLIC_CHROME_EXTENSION_URL}
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group sm:flex-1"
				>
					<div class="flex items-center gap-2">
						<Chromium size={24} class="text-primary group-hover:text-primary-content" />
						<div class="flex flex-col items-start">
							<span class="text-xs opacity-80">TILGJENGELIG I</span>
							<span class="font-bold text-sm">Chrome Store</span>
						</div>
					</div>
				</a>

				<a
					href="/products"
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group relative sm:flex-1"
				>
					<span
						class="badge badge-accent badge-sm absolute -top-2 -right-2 font-bold shadow-lg z-10"
						>NYHET</span
					>
					<div class="flex items-center gap-2">
						<Beer size={24} class="text-primary group-hover:text-primary-content" />
						<div class="flex flex-col items-start">
							<span class="text-xs opacity-80">ØLMONOPOLET I</span>
							<span class="font-bold text-sm">Nettleseren</span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.hero-image :global(svg) {
		width: 14rem;
		height: 14rem;
	}

	:global([data-theme='ølmonopolet-dark']) .hero-image :global(.st0) {
		fill: #e0a870;
	}

	:global([data-theme='ølmonopolet-dark']) .hero-image :global(.st10) {
		fill: #d9a86e;
	}

	:global([data-theme='ølmonopolet-dark']) .hero-image :global(.st15) {
		fill: #ebe0d9;
	}

	:global([data-theme='ølmonopolet-dark']) .hero-image :global(.beer) {
		fill: #c4841e;
	}

	:global([data-theme='ølmonopolet-dark']) .hero-image :global(.st16) {
		fill: #e8b060;
	}
</style>
