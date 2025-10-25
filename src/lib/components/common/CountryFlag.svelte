<script lang="ts">
	import type { CountryCode } from '$lib/constants';

	let { code }: { code: CountryCode | string | undefined } = $props();
</script>

{#if code}
	<span class="fi fi-{code.toLowerCase()}"></span>
{/if}
