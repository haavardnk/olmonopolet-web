<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta name="theme-color" content="#fbbf24" />
	<meta property="og:locale" content="nb_NO" />
</svelte:head>

<div id="svelte" class="flex flex-col min-h-screen">
	<slot />
</div>
