<script lang="ts">
	import { Play, Apple, Chrome } from '@lucide/svelte';
	import hero from '$lib/assets/hero.svg';
	import { fly } from 'svelte/transition';

	import {
		PUBLIC_APP_STORE_URL,
		PUBLIC_GOOGLE_PLAY_URL,
		PUBLIC_CHROME_EXTENSION_URL,
		PUBLIC_SITE_TITLE,
		PUBLIC_SITE_DESCRIPTION
	} from '$env/static/public';
</script>

<div class="hero py-12 bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<div class="relative flex items-center justify-center" in:fly={{ y: 20, duration: 300 }}>
				<img src={hero} alt="Ølmonopolet hero" class="w-56 h-56 object-contain" />
			</div>

			<div in:fly={{ y: 20, duration: 300, delay: 100 }}>
				<h1 class="text-4xl font-bold mb-4">{PUBLIC_SITE_TITLE}</h1>
				<p class="text-lg opacity-80 mb-8">
					{PUBLIC_SITE_DESCRIPTION}
				</p>
			</div>

			<div
				class="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
				in:fly={{ y: 20, duration: 300, delay: 200 }}
			>
				<a
					href={PUBLIC_GOOGLE_PLAY_URL}
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
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
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
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
					class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
				>
					<div class="flex items-center gap-2">
						<Chrome size={24} class="text-primary group-hover:text-primary-content" />
						<div class="flex flex-col items-start">
							<span class="text-xs opacity-80">TILGJENGELIG I</span>
							<span class="font-bold text-sm">Chrome Store</span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
</div>
