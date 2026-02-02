<script lang="ts">
	import { X } from '@lucide/svelte';

	type Props = {
		open: boolean;
		title: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		confirmClass?: string;
		isLoading?: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	};

	let {
		open,
		title,
		message,
		confirmLabel = 'Bekreft',
		cancelLabel = 'Avbryt',
		confirmClass = 'btn-error',
		isLoading = false,
		onConfirm,
		onCancel
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && !isLoading) {
			onCancel();
		}
	}
</script>

<dialog class="modal" class:modal-open={open} onkeydown={handleKeydown}>
	<div class="modal-box max-w-sm">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			onclick={onCancel}
			disabled={isLoading}
			aria-label="Lukk"
		>
			<X size={20} />
		</button>

		<h3 class="font-bold text-lg mb-4">{title}</h3>
		<p class="text-base-content/70">{message}</p>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={onCancel} disabled={isLoading}>
				{cancelLabel}
			</button>
			<button class="btn {confirmClass}" onclick={onConfirm} disabled={isLoading}>
				{#if isLoading}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				{confirmLabel}
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={onCancel} disabled={isLoading}>close</button>
	</form>
</dialog>
