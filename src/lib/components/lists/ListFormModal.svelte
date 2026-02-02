<script lang="ts">
	import type { UserList, ListType } from '$lib/types';
	import { X } from '@lucide/svelte';
	import { getListTypesArray } from '$lib/utils/list-types';

	type Props = {
		open: boolean;
		list?: UserList | null;
		onClose: () => void;
		onSave: (data: {
			name: string;
			description: string;
			listType: ListType;
			eventDate: string | null;
		}) => void;
		isSaving?: boolean;
	};

	let { open, list = null, onClose, onSave, isSaving = false }: Props = $props();

	let name = $state('');
	let description = $state('');
	let listType = $state<ListType>('standard');
	let eventDate = $state('');

	const isEditing = $derived(!!list);
	const title = $derived(isEditing ? 'Rediger liste' : 'Ny liste');
	const submitLabel = $derived(isEditing ? 'Lagre' : 'Opprett');
	const showEventDate = $derived(listType === 'event');
	const listTypes = getListTypesArray();

	$effect(() => {
		if (open) {
			name = list?.name ?? '';
			description = list?.description ?? '';
			listType = list?.listType ?? 'standard';
			eventDate = list?.eventDate ?? '';
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) return;
		onSave({
			name: name.trim(),
			description: description.trim(),
			listType,
			eventDate: showEventDate && eventDate ? eventDate : null
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<dialog class="modal" class:modal-open={open} onkeydown={handleKeydown}>
	<div class="modal-box max-w-md">
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
					placeholder="Valgfri beskrivelse"
					rows="2"
					disabled={isSaving}
				></textarea>
			</div>

			<fieldset class="form-control">
				<legend class="label">
					<span class="label-text">Type liste</span>
				</legend>
				<div class="grid grid-cols-2 gap-2">
					{#each listTypes as type}
						{@const Icon = type.icon}
						<button
							type="button"
							class="btn btn-sm h-auto py-2 justify-start gap-2 {listType === type.value
								? 'btn-primary'
								: 'btn-ghost border border-base-300'}"
							onclick={() => (listType = type.value)}
							disabled={isSaving}
						>
							<Icon size={16} />
							<div class="text-left">
								<div class="font-medium">{type.label}</div>
								<div class="text-xs opacity-70 font-normal">{type.description}</div>
							</div>
						</button>
					{/each}
				</div>
			</fieldset>

			{#if showEventDate}
				<div class="form-control">
					<label class="label" for="event-date">
						<span class="label-text">Dato for arrangement</span>
					</label>
					<input
						id="event-date"
						type="date"
						class="input input-bordered w-full"
						bind:value={eventDate}
						disabled={isSaving}
					/>
				</div>
			{/if}

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
