<script lang="ts">
	import type { UserList } from '$lib/types';
	import { X } from '@lucide/svelte';
	import { LIST_PRESETS, matchPreset, type ListFlags } from '$lib/utils/list-types';

	type Props = {
		open: boolean;
		list?: UserList | null;
		onClose: () => void;
		onSave: (data: {
			name: string;
			description: string;
			showQuantity: boolean;
			showStore: boolean;
			showVintage: boolean;
			showPrices: boolean;
			showNotes: boolean;
			eventDate: string | null;
		}) => void;
		isSaving?: boolean;
	};

	let { open, list = null, onClose, onSave, isSaving = false }: Props = $props();

	let name = $state('');
	let description = $state('');
	let showQuantity = $state(false);
	let showStore = $state(false);
	let showVintage = $state(false);
	let showPrices = $state(true);
	let showNotes = $state(false);
	let eventDate = $state('');
	let customizeOpen = $state(false);

	const isEditing = $derived(!!list);
	const title = $derived(isEditing ? 'Rediger liste' : 'Ny liste');
	const submitLabel = $derived(isEditing ? 'Lagre' : 'Opprett');

	const currentFlags: ListFlags = $derived({
		showQuantity,
		showStore,
		showVintage,
		showPrices,
		showNotes
	});
	const activePreset = $derived(matchPreset(currentFlags));
	const isCustom = $derived(!activePreset);

	$effect(() => {
		if (open) {
			name = list?.name ?? '';
			description = list?.description ?? '';
			showQuantity = list?.showQuantity ?? false;
			showStore = list?.showStore ?? false;
			showVintage = list?.showVintage ?? false;
			showPrices = list?.showPrices ?? true;
			showNotes = list?.showNotes ?? false;
			eventDate = list?.eventDate ?? '';
			customizeOpen = false;
		}
	});

	function selectPreset(flags: ListFlags) {
		showQuantity = flags.showQuantity;
		showStore = flags.showStore;
		showVintage = flags.showVintage;
		showPrices = flags.showPrices;
		showNotes = flags.showNotes;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim()) return;
		onSave({
			name: name.trim(),
			description: description.trim(),
			showQuantity,
			showStore,
			showVintage,
			showPrices,
			showNotes,
			eventDate: eventDate || null
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
					<span class="label-text">Hurtigvalg</span>
				</legend>
				<div class="grid grid-cols-3 gap-2">
					{#each LIST_PRESETS as preset}
						{@const Icon = preset.icon}
						<button
							type="button"
							class="btn btn-sm h-auto py-2 flex-col gap-1 {activePreset?.id === preset.id
								? 'btn-primary'
								: 'btn-ghost border border-base-300'}"
							onclick={() => selectPreset(preset.flags)}
							disabled={isSaving}
						>
							<Icon size={16} />
							<span class="text-xs font-medium">{preset.label}</span>
						</button>
					{/each}
				</div>
			</fieldset>

			<div class="collapse collapse-arrow bg-base-200 rounded-lg" class:collapse-open={customizeOpen}>
				<button
					type="button"
					class="collapse-title text-sm font-medium min-h-0 py-2 px-4"
					onclick={() => (customizeOpen = !customizeOpen)}
				>
					Tilpass
				</button>
				<div class="collapse-content !p-0">
					<div class="space-y-2 px-4 pb-3">
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<span class="label-text font-medium">Antall</span>
								<span class="label-text-alt block text-xs opacity-70">Mengdekontroller på hvert produkt</span>
							</div>
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={showQuantity}
								disabled={isSaving}
							/>
						</label>
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<span class="label-text font-medium">Butikk</span>
								<span class="label-text-alt block text-xs opacity-70">Lagerstatus og butikkvalg</span>
							</div>
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={showStore}
								disabled={isSaving}
							/>
						</label>
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<span class="label-text font-medium">Årgang</span>
								<span class="label-text-alt block text-xs opacity-70">Spor årgang og kjellerlager</span>
							</div>
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={showVintage}
								disabled={isSaving}
							/>
						</label>
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<span class="label-text font-medium">Vis priser</span>
								<span class="label-text-alt block text-xs opacity-70">Vis prisinformasjon på produkter</span>
							</div>
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={showPrices}
								disabled={isSaving}
							/>
						</label>
						<label class="flex items-center justify-between cursor-pointer">
							<div>
								<span class="label-text font-medium">Notater</span>
								<span class="label-text-alt block text-xs opacity-70">Legg til notater på hvert produkt</span>
							</div>
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={showNotes}
								disabled={isSaving}
							/>
						</label>
					</div>
				</div>
			</div>

			<div class="form-control">
				<label class="label" for="event-date">
					<span class="label-text">Dato for arrangement</span>
					<span class="label-text-alt text-xs opacity-50">Valgfritt</span>
				</label>
				<input
					id="event-date"
					type="date"
					class="input input-bordered w-full"
					bind:value={eventDate}
					disabled={isSaving}
				/>
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
