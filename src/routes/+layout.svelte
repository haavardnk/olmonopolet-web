<script lang="ts">
	import '../app.css';

	import { PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_DESCRIPTION } from '$env/static/public';
	import hero from '$lib/assets/hero.svg';

	const siteTitle = PUBLIC_SITE_TITLE;
	const siteDescription = PUBLIC_SITE_DESCRIPTION;
	const siteUrl = PUBLIC_SITE_URL;
	const siteImage = hero;
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta name="description" content={siteDescription} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={siteUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content={siteImage} />
	<meta property="og:site_name" content={siteTitle} />
	<meta name="theme-color" content="#fbbf24" />
	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'name': siteTitle,
			'url': siteUrl,
			'logo': siteImage,
			'description': siteDescription
		})}
	</script>
</svelte:head>

<div id="svelte" class="flex flex-col min-h-screen">
	<slot />
</div>
