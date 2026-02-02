<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';
	import type { UserList, ListType } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ListCard from '$lib/components/lists/ListCard.svelte';
	import ListFormModal from '$lib/components/lists/ListFormModal.svelte';
	import ShareModal from '$lib/components/lists/ShareModal.svelte';
	import ConfirmModal from '$lib/components/common/ConfirmModal.svelte';
	import EmptyListsState from '$lib/components/lists/EmptyListsState.svelte';
	import { Plus, ArrowLeft, CircleAlert, EyeOff } from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import { fetchAndSetLists, transformApiList } from '$lib/utils/lists';

	let error = $state<string | null>(null);
	let showFormModal = $state(false);
	let editingList = $state<UserList | null>(null);
	let isSaving = $state(false);
	let showShareModal = $state(false);
	let sharingList = $state<UserList | null>(null);
	let showDeleteConfirm = $state(false);
	let deletingList = $state<UserList | null>(null);
	let isDeleting = $state(false);
	let dragItems = $state<UserList[] | null>(null);
	let hidePastEvents = $state(false);

	const flipDurationMs = 200;
	const isLoading = $derived(listsStore.isLoading);
	const storeItems = $derived(listsStore.sortedLists);
	const filteredItems = $derived(
		hidePastEvents ? storeItems.filter((item) => !item.isPast) : storeItems
	);
	const items = $derived(dragItems ?? filteredItems);
	const hasPastEvents = $derived(storeItems.some((item) => item.isPast));

	$effect(() => {
		if (browser && authStore.isAuthenticated) fetchAndSetLists();
	});

	function openCreateModal() {
		editingList = null;
		showFormModal = true;
	}

	function closeFormModal() {
		showFormModal = false;
		editingList = null;
	}

	async function handleSave(data: {
		name: string;
		description: string;
		listType: ListType;
		eventDate: string | null;
	}) {
		isSaving = true;
		try {
			if (editingList) {
				const res = await fetch(`/api/lists/${editingList.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: data.name,
						description: data.description,
						list_type: data.listType,
						event_date: data.eventDate
					})
				});
				if (!res.ok) throw new Error('Failed to update list');
				const updated = await res.json();
				listsStore.updateList(editingList.id, {
					name: updated.name,
					description: updated.description,
					listType: updated.list_type,
					eventDate: updated.event_date,
					updatedAt: updated.updated_at
				});
			} else {
				const res = await fetch('/api/lists', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: data.name,
						description: data.description,
						list_type: data.listType,
						event_date: data.eventDate
					})
				});
				if (!res.ok) throw new Error('Failed to create list');
				listsStore.addList(transformApiList(await res.json()));
			}
			closeFormModal();
		} catch (err: any) {
			error = err.message;
		} finally {
			isSaving = false;
		}
	}

	async function handleDelete() {
		if (!deletingList) return;
		isDeleting = true;
		try {
			const res = await fetch(`/api/lists/${deletingList.id}`, { method: 'DELETE' });
			if (!res.ok && res.status !== 204) throw new Error('Failed to delete list');
			listsStore.deleteList(deletingList.id);
			showDeleteConfirm = false;
			deletingList = null;
		} catch (err: any) {
			error = err.message;
		} finally {
			isDeleting = false;
		}
	}

	function handleDndConsider(e: CustomEvent<DndEvent<UserList>>) {
		dragItems = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<UserList>>) {
		dragItems = e.detail.items;
		const orderedIds = dragItems.map((item) => item.id);
		listsStore.reorderLists(orderedIds);
		dragItems = null;
		try {
			await fetch('/api/lists/reorder', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ list_ids: orderedIds.map((id) => parseInt(id)) })
			});
		} catch {
			fetchAndSetLists();
		}
	}
</script>

<Header showUserMenu={true}>
	{#snippet right()}
		<button onclick={() => goto('/products')} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
			<ArrowLeft size={16} />
			Tilbake
		</button>
	{/snippet}
</Header>

{#if !authStore.isAuthenticated && !authStore.loading}
	<div class="container mx-auto px-4 py-16 max-w-md text-center">
		<CircleAlert size={48} class="mx-auto mb-4 text-warning" />
		<h1 class="text-2xl font-bold mb-2">Logg inn for å se dine lister</h1>
		<p class="text-base-content/70 mb-6">
			Du må være logget inn for å opprette og administrere lister.
		</p>
		<a href="/login" class="btn btn-primary">Logg inn</a>
	</div>
{:else if isLoading}
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="flex justify-center py-16">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-3xl font-bold">Mine lister</h1>
			{#if listsStore.sortedLists.length > 0}
				<button class="btn btn-primary btn-sm" onclick={openCreateModal}>
					<Plus size={18} />
					Ny liste
				</button>
			{/if}
		</div>

		{#if error}
			<div class="alert alert-error mb-4">
				<CircleAlert size={20} />
				<span>{error}</span>
			</div>
		{:else if items.length === 0 && !hidePastEvents}
			<EmptyListsState onCreate={openCreateModal} />
		{:else if items.length === 0 && hidePastEvents}
			<div class="text-center py-12">
				<p class="text-base-content/70 mb-4">Ingen aktive arrangementer</p>
				<button class="btn btn-ghost btn-sm" onclick={() => (hidePastEvents = false)}>
					Vis passerte arrangementer
				</button>
			</div>
		{:else}
			<div class="flex items-center justify-between mb-4">
				<p class="text-sm text-base-content/60">Dra i håndtaket for å endre rekkefølge</p>
				{#if hasPastEvents}
					<label class="label cursor-pointer gap-2">
						<EyeOff size={16} class="text-base-content/60" />
						<span class="label-text text-sm">Skjul passerte</span>
						<input type="checkbox" class="toggle toggle-sm" bind:checked={hidePastEvents} />
					</label>
				{/if}
			</div>
			<div
				class="space-y-3"
				use:dragHandleZone={{ items, flipDurationMs }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each items as item (item.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<ListCard
							list={item}
							onEdit={(list) => {
								editingList = list;
								showFormModal = true;
							}}
							onDelete={(list) => {
								deletingList = list;
								showDeleteConfirm = true;
							}}
							onShare={(list) => {
								sharingList = list;
								showShareModal = true;
							}}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<ListFormModal
	open={showFormModal}
	list={editingList}
	onClose={closeFormModal}
	onSave={handleSave}
	{isSaving}
/>

{#if sharingList}
	<ShareModal
		open={showShareModal}
		listName={sharingList.name}
		shareToken={sharingList.shareToken}
		onClose={() => {
			showShareModal = false;
			sharingList = null;
		}}
	/>
{/if}

{#if deletingList}
	<ConfirmModal
		open={showDeleteConfirm}
		title="Slett liste"
		message={`Er du sikker på at du vil slette "${deletingList.name}"? Dette kan ikke angres.`}
		confirmLabel="Slett"
		confirmClass="btn-error"
		isLoading={isDeleting}
		onConfirm={handleDelete}
		onCancel={() => {
			showDeleteConfirm = false;
			deletingList = null;
		}}
	/>
{/if}
