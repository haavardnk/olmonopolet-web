<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_DESCRIPTION } from '$env/static/public';

	if (browser) {
		sessionStorage.setItem('hasNavigated', 'true');
	}

	const organizationJson = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: PUBLIC_SITE_TITLE,
		url: PUBLIC_SITE_URL,
		logo: `${PUBLIC_SITE_URL}/icon.png`,
		description: PUBLIC_SITE_DESCRIPTION
	};
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta name="theme-color" content="#FFDEB6" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#FFDEB6" media="(prefers-color-scheme: dark)" />
	<meta property="og:locale" content="nb_NO" />
	{@html `<script type="application/ld+json">${JSON.stringify(organizationJson)}</script>`}
</svelte:head>

<div id="svelte" class="flex flex-col min-h-screen">
	<slot />
</div>
