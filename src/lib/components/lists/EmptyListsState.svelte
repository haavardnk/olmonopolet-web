<script lang="ts">
	import { ListPlus } from '@lucide/svelte';

	type Props = {
		onCreate: () => void;
	};

	let { onCreate }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
	<div class="text-6xl mb-6">📋</div>
	<h2 class="text-2xl font-bold mb-2">Ingen lister ennå</h2>
	<p class="text-base-content/70 mb-6 max-w-sm">
		Opprett din første liste for å samle og organisere dine favorittøl.
	</p>
	<button class="btn btn-primary" onclick={onCreate}>
		<ListPlus size={20} />
		Opprett din første liste
	</button>
</div>
