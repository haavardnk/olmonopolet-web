<script lang="ts">
	import type { UserList } from '$lib/types';
	import { X } from '@lucide/svelte';

	type Props = {
		open: boolean;
		list?: UserList | null;
		onClose: () => void;
		onSave: (data: { name: string; description: string }) => void;
		isSaving?: boolean;
	};

	let { open, list = null, onClose, onSave, isSaving = false }: Props = $props();

	let name = $state('');
	let description = $state('');

	const isEditing = $derived(!!list);
	const title = $derived(isEditing ? 'Rediger liste' : 'Ny liste');
	const submitLabel = $derived(isEditing ? 'Lagre' : 'Opprett');

	$effect(() => {
		if (open) {
			name = list?.name ?? '';
			description = list?.description ?? '';
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) return;
		onSave({ name: name.trim(), description: description.trim() });
	}

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

		<h3 class="font-bold text-lg mb-4">{title}</h3>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="form-control">
				<label class="label" for="list-name">
					<span class="label-text">Navn *</span>
				</label>
				<input
					id="list-name"
					type="text"
					class="input input-bordered w-full"
					bind:value={name}
					placeholder="F.eks. Mine favoritter"
					maxlength="100"
					required
					disabled={isSaving}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="list-description">
					<span class="label-text">Beskrivelse</span>
				</label>
				<textarea
					id="list-description"
					class="textarea textarea-bordered w-full"
					bind:value={description}
					placeholder="Valgfri beskrivelse av listen"
					rows="3"
					disabled={isSaving}
				></textarea>
			</div>

			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={onClose} disabled={isSaving}>
					Avbryt
				</button>
				<button type="submit" class="btn btn-primary" disabled={!name.trim() || isSaving}>
					{#if isSaving}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{submitLabel}
				</button>
			</div>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={onClose}>close</button>
	</form>
</dialog>
