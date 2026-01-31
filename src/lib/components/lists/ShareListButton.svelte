<script lang="ts">
	import { Check, Link } from '@lucide/svelte';

	type Props = {
		shareToken: string;
	};

	let { shareToken }: Props = $props();

	let copied = $state(false);

	const shareUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/lists/shared/${shareToken}`
			: `/lists/shared/${shareToken}`
	);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="flex items-center gap-2">
	<input
		type="text"
		class="input input-bordered input-sm flex-1 text-xs"
		value={shareUrl}
		readonly
	/>
	<button
		class="btn btn-sm"
		class:btn-success={copied}
		onclick={copyToClipboard}
		aria-label={copied ? 'Kopiert!' : 'Kopier lenke'}
	>
		{#if copied}
			<Check size={16} />
			Kopiert!
		{:else}
			<Link size={16} />
			Kopier
		{/if}
	</button>
</div>
