<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		target?: HTMLElement | string;
	};

	let { children, target = 'body' }: Props = $props();

	let portalEl = $state<HTMLDivElement | null>(null);
	let targetEl = $state<HTMLElement | null>(null);
	let mounted = $state(false);

	onMount(() => {
		if (typeof target === 'string') {
			targetEl = document.querySelector(target);
		} else {
			targetEl = target;
		}

		if (targetEl && portalEl) {
			targetEl.appendChild(portalEl);
			mounted = true;
		}

		return () => {
			if (portalEl && portalEl.parentNode) {
				portalEl.parentNode.removeChild(portalEl);
			}
		};
	});
</script>

<div bind:this={portalEl} class="contents">
	{#if mounted}
		{@render children()}
	{/if}
</div>
