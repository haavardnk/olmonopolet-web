<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';
	import type { UserList, Product } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import ListFormModal from '$lib/components/lists/ListFormModal.svelte';
	import ShareListButton from '$lib/components/lists/ShareListButton.svelte';
	import {
		ArrowLeft,
		Pencil,
		Share2,
		Trash2,
		CircleAlert,
		Beer,
		GripVertical
	} from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { dragHandleZone, dragHandle, type DndEvent } from 'svelte-dnd-action';
	import { toggleTastedStatus, updateProductTasted } from '$lib/utils/tasted';
	import { transformApiList } from '$lib/utils/lists';

	let listId = $derived($page.params.id);

	let list = $state<UserList | null>(null);
	let products = $state<Product[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let showEditModal = $state(false);
	let isSaving = $state(false);
	let showShareModal = $state(false);
	let showDeleteConfirm = $state(false);
	let isDeleting = $state(false);
	let tastedLoadingMap = $state<Map<string, boolean>>(new Map());
	let items = $state<Product[]>([]);

	const flipDurationMs = 200;

	$effect(() => {
		if (authStore.isAuthenticated && listId) fetchListAndProducts();
		else if (!authStore.loading) isLoading = false;
	});

	$effect(() => {
		items = products.map((p) => ({ ...p }));
	});

	async function fetchListAndProducts() {
		isLoading = true;
		error = null;
		try {
			const res = await fetch(`/api/lists/${listId}`);
			if (!res.ok)
				throw new Error(res.status === 404 ? 'Listen ble ikke funnet' : 'Kunne ikke hente listen');

			list = transformApiList(await res.json());
			listsStore.addList(list);

			if (list.productIds.length > 0) {
				const prodRes = await fetch(`/api/products?ids=${list.productIds.join(',')}`);
				if (prodRes.ok) {
					const data = await prodRes.json();
					const productMap = new Map<string, Product>();
					(data.products || []).forEach((p: Product) => productMap.set(String(p.id), p));
					products = list.productIds
						.map((id) => productMap.get(String(id)))
						.filter((p): p is Product => !!p);
				}
			} else {
				products = [];
			}
		} catch (err: any) {
			error = err.message || 'En feil oppstod';
		} finally {
			isLoading = false;
		}
	}

	async function handleTastedToggle(productId: string, currentState: boolean) {
		tastedLoadingMap.set(productId, true);
		tastedLoadingMap = new Map(tastedLoadingMap);
		await toggleTastedStatus(productId, currentState, (newState) => {
			products = updateProductTasted(products, productId, newState);
		});
		tastedLoadingMap.delete(productId);
		tastedLoadingMap = new Map(tastedLoadingMap);
	}

	async function handleSave(data: { name: string; description: string }) {
		if (!list) return;
		isSaving = true;
		try {
			const res = await fetch(`/api/lists/${list.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!res.ok) throw new Error('Failed to update list');
			const updated = await res.json();
			list = {
				...list,
				name: updated.name,
				description: updated.description,
				updatedAt: updated.updated_at
			};
			listsStore.updateList(list.id, list);
			showEditModal = false;
		} catch (err: any) {
			error = err.message;
		} finally {
			isSaving = false;
		}
	}

	async function handleDelete() {
		if (!list) return;
		isDeleting = true;
		try {
			const res = await fetch(`/api/lists/${list.id}`, { method: 'DELETE' });
			if (!res.ok && res.status !== 204) throw new Error('Failed to delete list');
			listsStore.deleteList(list.id);
			goto('/lists');
		} catch (err: any) {
			error = err.message;
		} finally {
			isDeleting = false;
		}
	}

	async function removeProduct(productId: string | number) {
		if (!list) return;
		const id = String(productId);
		try {
			const res = await fetch(`/api/lists/${list.id}/products/${id}`, { method: 'DELETE' });
			if (res.ok || res.status === 204) {
				products = products.filter((p) => String(p.id) !== id);
				listsStore.removeProductFromList(list.id, id);
				list = { ...list, productIds: list.productIds.filter((pid) => String(pid) !== id) };
			}
		} catch {}
	}

	function handleDndConsider(e: CustomEvent<DndEvent<Product>>) {
		items = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<Product>>) {
		items = e.detail.items;
		products = items.map((item) => ({ ...item }));
		if (!list) return;
		const orderedIds = items.map((item) => String(item.id));
		listsStore.reorderProducts(list.id, orderedIds);
		list = { ...list, productIds: orderedIds };
		try {
			await fetch(`/api/lists/${list.id}/products/reorder`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					order: items.map((item, i) => ({ product_id: Number(item.id), position: i }))
				})
			});
		} catch (err) {
			console.error('Failed to save order:', err);
		}
	}
</script>

<Header showUserMenu={true}>
	{#snippet right()}
		<button onclick={() => goto('/lists')} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
			<ArrowLeft size={16} />
			Tilbake
		</button>
	{/snippet}
</Header>

{#if !authStore.isAuthenticated && !authStore.loading}
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="alert alert-warning">
			<CircleAlert size={20} />
			<span>Du må være innlogget for å se denne listen.</span>
		</div>
		<div class="mt-4">
			<a href="/login" class="btn btn-primary">Logg inn</a>
		</div>
	</div>
{:else if isLoading}
	<div class="container mx-auto px-4 py-8">
		<div class="flex justify-center py-16">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	</div>
{:else if error}
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<div class="alert alert-error">
			<CircleAlert size={20} />
			<span>{error}</span>
		</div>
		<div class="mt-4">
			<a href="/lists" class="btn btn-ghost">Tilbake til lister</a>
		</div>
	</div>
{:else if list}
	<div class="container mx-auto px-4 py-8 max-w-6xl">
		<div class="mb-6">
			<div class="flex items-start justify-between gap-4 mb-2">
				<h1 class="text-3xl font-bold">{list.name}</h1>
				<div class="flex items-center gap-1 shrink-0">
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={() => (showShareModal = true)}
						aria-label="Del liste"
					>
						<Share2 size={18} />
					</button>
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={() => (showEditModal = true)}
						aria-label="Rediger liste"
					>
						<Pencil size={18} />
					</button>
					<button
						class="btn btn-ghost btn-sm btn-square text-error"
						onclick={() => (showDeleteConfirm = true)}
						aria-label="Slett liste"
					>
						<Trash2 size={18} />
					</button>
				</div>
			</div>
			{#if list.description}
				<p class="text-base-content/70 mb-2">{list.description}</p>
			{/if}
			<div class="flex items-center gap-1 text-sm text-base-content/60">
				<Beer size={16} />
				<span>{products.length} {products.length === 1 ? 'produkt' : 'produkter'}</span>
			</div>
		</div>

		{#if products.length === 0}
			<div class="text-center py-16">
				<div class="text-5xl mb-4">🍺</div>
				<h2 class="text-xl font-semibold mb-2">Ingen produkter i listen</h2>
				<p class="text-base-content/70 mb-4">
					Legg til produkter fra produktsiden ved å klikke på liste-ikonet.
				</p>
				<a href="/products" class="btn btn-primary">Utforsk produkter</a>
			</div>
		{:else}
			<p class="text-sm text-base-content/60 mb-4">Dra i håndtaket for å endre rekkefølge</p>
			<div
				class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4"
				use:dragHandleZone={{ items, flipDurationMs }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each items as item, index (item.id)}
					<div animate:flip={{ duration: flipDurationMs }} class="relative group">
						<div class="absolute top-2 left-2 z-20 flex gap-2">
							<div
								use:dragHandle
								aria-label="Dra for å endre rekkefølge"
								class="btn btn-sm btn-circle bg-base-100 border-base-content/20 cursor-grab active:cursor-grabbing"
							>
								<GripVertical size={14} />
							</div>
							<button
								class="btn btn-sm btn-circle btn-error sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									removeProduct(item.id);
								}}
								aria-label="Fjern fra liste"
							>
								<Trash2 size={14} />
							</button>
						</div>
						<ProductCard
							product={item}
							{index}
							noTransition={true}
							onTastedToggle={handleTastedToggle}
							isTogglingTasted={tastedLoadingMap.get(item.id) || false}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<ListFormModal
	open={showEditModal}
	{list}
	onClose={() => (showEditModal = false)}
	onSave={handleSave}
	{isSaving}
/>

<dialog class="modal" class:modal-open={showShareModal}>
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Del liste</h3>
		{#if list}
			<p class="text-sm text-base-content/70 mb-4">Alle med lenken kan se listen "{list.name}".</p>
			<ShareListButton shareToken={list.shareToken} />
		{/if}
		<div class="modal-action">
			<button class="btn" onclick={() => (showShareModal = false)}>Lukk</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showShareModal = false)}>close</button>
	</form>
</dialog>

<dialog class="modal" class:modal-open={showDeleteConfirm}>
	<div class="modal-box">
		<h3 class="font-bold text-lg mb-4">Slett liste</h3>
		{#if list}
			<p class="text-base-content/70">
				Er du sikker på at du vil slette "{list.name}"? Dette kan ikke angres.
			</p>
		{/if}
		<div class="modal-action">
			<button
				class="btn btn-ghost"
				onclick={() => (showDeleteConfirm = false)}
				disabled={isDeleting}>Avbryt</button
			>
			<button class="btn btn-error" onclick={handleDelete} disabled={isDeleting}>
				{#if isDeleting}<span class="loading loading-spinner loading-sm"></span>{/if}
				Slett
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showDeleteConfirm = false)}>close</button>
	</form>
</dialog>
