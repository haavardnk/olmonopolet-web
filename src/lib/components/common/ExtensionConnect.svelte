<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { getExtensionStatus, connectExtension } from '$lib/extension';
	import { Puzzle, CircleCheck } from '@lucide/svelte';

	let installed = $state(false);
	let connected = $state(false);
	let connecting = $state(false);

	async function refresh() {
		const status = await getExtensionStatus();
		installed = status.installed;
		connected = status.connected;
	}

	onMount(refresh);

	async function handleConnect() {
		if (connecting) return;
		connecting = true;
		const ok = await connectExtension();
		connecting = false;
		if (ok) connected = true;
	}
</script>

{#if authStore.isAuthenticated && installed}
	{#if connected}
		<div class="btn btn-ghost btn-block justify-start gap-3 no-animation pointer-events-none">
			<CircleCheck size={18} class="text-success" />
			Nettleserutvidelse tilkoblet
		</div>
	{:else}
		<button
			class="btn btn-ghost btn-block justify-start gap-3"
			onclick={handleConnect}
			disabled={connecting}
		>
			<Puzzle size={18} />
			{connecting ? 'Kobler til...' : 'Koble til nettleserutvidelse'}
		</button>
	{/if}
{/if}
