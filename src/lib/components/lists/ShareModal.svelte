<script lang="ts">
	import { X } from '@lucide/svelte';
	import ShareListButton from './ShareListButton.svelte';

	type Props = {
		open: boolean;
		listName: string;
		shareToken: string;
		onClose: () => void;
	};

	let { open, listName, shareToken, onClose }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<dialog class="modal" class:modal-open={open} onkeydown={handleKeydown}>
	<div class="modal-box">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			onclick={onClose}
			aria-label="Lukk"
		>
			<X size={20} />
		</button>

		<h3 class="font-bold text-lg mb-4">Del liste</h3>
		<p class="text-sm text-base-content/70 mb-4">
			Alle med lenken kan se listen "{listName}".
		</p>
		<ShareListButton {shareToken} />

		<div class="modal-action">
			<button class="btn" onclick={onClose}>Lukk</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={onClose}>close</button>
	</form>
</dialog>
