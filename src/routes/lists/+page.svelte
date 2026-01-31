<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';
	import type { UserList } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ListCard from '$lib/components/lists/ListCard.svelte';
	import ListFormModal from '$lib/components/lists/ListFormModal.svelte';
	import ShareListButton from '$lib/components/lists/ShareListButton.svelte';
	import EmptyListsState from '$lib/components/lists/EmptyListsState.svelte';
	import { Plus, ArrowLeft, CircleAlert } from '@lucide/svelte';
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

	const flipDurationMs = 200;
	const isLoading = $derived(listsStore.isLoading);
	const storeItems = $derived(listsStore.sortedLists);
	const items = $derived(dragItems ?? storeItems);

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

	async function handleSave(data: { name: string; description: string }) {
		isSaving = true;
		try {
			if (editingList) {
				const res = await fetch(`/api/lists/${editingList.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
				if (!res.ok) throw new Error('Failed to update list');
				const updated = await res.json();
				listsStore.updateList(editingList.id, {
					name: updated.name,
					description: updated.description,
					updatedAt: updated.updated_at
				});
			} else {
				const res = await fetch('/api/lists', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
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
		dragItems = null; // Reset to use store items
		try {
			await fetch('/api/lists/reorder', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ order: storeItems.map((item, i) => ({ id: item.id, sort_order: i })) })
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
		{:else if items.length === 0}
			<EmptyListsState onCreate={openCreateModal} />
		{:else}
			<p class="text-sm text-base-content/60 mb-4">Dra i håndtaket for å endre rekkefølge</p>
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

<dialog class="modal" class:modal-open={showShareModal}>
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Del liste</h3>
		{#if sharingList}
			<p class="text-sm text-base-content/70 mb-4">
				Alle med lenken kan se listen "{sharingList.name}".
			</p>
			<ShareListButton shareToken={sharingList.shareToken} />
		{/if}
		<div class="modal-action">
			<button
				class="btn"
				onclick={() => {
					showShareModal = false;
					sharingList = null;
				}}>Lukk</button
			>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button
			onclick={() => {
				showShareModal = false;
				sharingList = null;
			}}>close</button
		>
	</form>
</dialog>

<dialog class="modal" class:modal-open={showDeleteConfirm}>
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Slett liste</h3>
		{#if deletingList}
			<p class="text-base-content/70">
				Er du sikker på at du vil slette "{deletingList.name}"? Dette kan ikke angres.
			</p>
		{/if}
		<div class="modal-action">
			<button
				class="btn btn-ghost"
				onclick={() => {
					showDeleteConfirm = false;
					deletingList = null;
				}}
				disabled={isDeleting}>Avbryt</button
			>
			<button class="btn btn-error" onclick={handleDelete} disabled={isDeleting}>
				{#if isDeleting}<span class="loading loading-spinner loading-sm"></span>{/if}
				Slett
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button
			onclick={() => {
				showDeleteConfirm = false;
				deletingList = null;
			}}>close</button
		>
	</form>
</dialog>
