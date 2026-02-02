<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';
	import type { UserList, Product, ListItemWithProduct, ListType } from '$lib/types';
	import Header from '$lib/components/common/Header.svelte';
	import ListFormModal from '$lib/components/lists/ListFormModal.svelte';
	import ShareModal from '$lib/components/lists/ShareModal.svelte';
	import StoreSelector from '$lib/components/lists/StoreSelector.svelte';
	import ListItemRow from '$lib/components/lists/ListItemRow.svelte';
	import ListTypeBadge from '$lib/components/lists/ListTypeBadge.svelte';
	import CellarStats from '$lib/components/lists/CellarStats.svelte';
	import ShoppingTotalBar from '$lib/components/lists/ShoppingTotalBar.svelte';
	import ConfirmModal from '$lib/components/common/ConfirmModal.svelte';
	import { ArrowLeft, Pencil, Share2, Trash2, CircleAlert, Beer, Calendar } from '@lucide/svelte';
	import { flip } from 'svelte/animate';
	import { dragHandleZone, type DndEvent } from 'svelte-dnd-action';
	import { transformApiList } from '$lib/utils/lists';
	import { formatLongDate } from '$lib/utils/formatters';
	import { getProductCountLabel } from '$lib/utils/formatters';

	let listId = $derived($page.params.id);

	let list = $state<UserList | null>(null);
	let products = $state<Product[]>([]);
	let listItems = $state<ListItemWithProduct[]>([]);
	let selectedStoreId = $state<number | null>(null);

	let isLoading = $state(true);
	let error = $state<string | null>(null);

	let showEditModal = $state(false);
	let showShareModal = $state(false);
	let showDeleteConfirm = $state(false);

	let isSaving = $state(false);
	let isDeleting = $state(false);

	let expandedNotes = $state<Set<string>>(new Set());
	let editingNotesId = $state<string | null>(null);
	let notesValue = $state('');

	let items = $state<ListItemWithProduct[]>([]);
	const flipDurationMs = 200;

	const isShopping = $derived(list?.listType === 'shopping');
	const isCellar = $derived(list?.listType === 'cellar');
	const isEvent = $derived(list?.listType === 'event');

	const calculatedTotalPrice = $derived.by(() => {
		if (!isShopping) return 0;
		return listItems.reduce((sum, item) => {
			const price = item.product?.price ?? 0;
			return sum + price * (item.quantity ?? 1);
		}, 0);
	});

	const totalQuantity = $derived(listItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0));

	$effect(() => {
		if (authStore.isAuthenticated && listId) {
			fetchListAndProducts();
		} else if (!authStore.loading) {
			isLoading = false;
		}
	});

	$effect(() => {
		items = listItems.map((item) => ({ ...item }));
	});

	function syncListToStore() {
		if (!list) return;

		const totalQty = listItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
		const totalPrice = listItems.reduce((sum, item) => {
			const price = item.product?.price ?? 0;
			return sum + price * (item.quantity ?? 1);
		}, 0);
		const years = listItems.map((i) => i.year).filter((y): y is number => y !== null);

		listsStore.updateList(list.id, {
			productIds: listItems.map((i) => i.productId),
			itemCount: totalQty,
			totalPrice: isShopping ? totalPrice : undefined,
			stats: isCellar
				? {
						totalBottles: totalQty,
						totalValue: totalPrice,
						oldestYear: years.length > 0 ? Math.min(...years) : null,
						newestYear: years.length > 0 ? Math.max(...years) : null
					}
				: undefined
		});
	}

	async function fetchListAndProducts() {
		isLoading = true;
		error = null;

		try {
			const res = await fetch(`/api/lists/${listId}`);
			if (!res.ok) {
				throw new Error(res.status === 404 ? 'Listen ble ikke funnet' : 'Kunne ikke hente listen');
			}

			const apiData = await res.json();
			list = transformApiList(apiData);
			listsStore.addList(list);

			if (apiData.selected_store_id) {
				selectedStoreId = apiData.selected_store_id;
			}

			if (apiData.items?.length > 0) {
				const productIds = [...new Set(apiData.items.map((item: any) => String(item.product_id)))];
				const storeParam = selectedStoreId ? `&check_store=${selectedStoreId}` : '';
				const prodRes = await fetch(`/api/products?ids=${productIds.join(',')}${storeParam}`);

				const productMap = new Map<string, Product>();
				if (prodRes.ok) {
					const data = await prodRes.json();
					(data.products || []).forEach((p: Product) => productMap.set(String(p.id), p));
				}

				listItems = apiData.items.map((item: any) => ({
					id: String(item.id),
					productId: String(item.product_id),
					quantity: item.quantity ?? 1,
					year: item.year ?? null,
					notes: item.notes ?? null,
					sortOrder: item.sort_order ?? 0,
					createdAt: item.created_at ?? new Date().toISOString(),
					product: productMap.get(String(item.product_id)) ?? null
				}));
				products = listItems.map((item) => item.product).filter((p): p is Product => !!p);
			} else {
				products = [];
				listItems = [];
			}
		} catch (err: any) {
			error = err.message || 'En feil oppstod';
		} finally {
			isLoading = false;
		}
	}

	async function updateItemField(
		itemId: string,
		field: 'quantity' | 'year' | 'notes' | 'created_at',
		value: number | string | null
	) {
		if (!list) return;

		try {
			const res = await fetch(`/api/lists/${list.id}/items/${itemId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [field]: value })
			});

			if (res.ok) {
				const localField = field === 'created_at' ? 'createdAt' : field;
				listItems = listItems.map((item) =>
					item.id === itemId ? { ...item, [localField]: value } : item
				);
				syncListToStore();
			}
		} catch {}
	}

	async function handleSave(data: {
		name: string;
		description: string;
		listType: ListType;
		eventDate: string | null;
	}) {
		if (!list) return;
		isSaving = true;

		try {
			const res = await fetch(`/api/lists/${list.id}`, {
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
			list = {
				...list,
				name: updated.name,
				description: updated.description,
				listType: updated.list_type,
				eventDate: updated.event_date,
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

	async function removeItem(itemId: string, productId: string) {
		if (!list) return;

		try {
			const res = await fetch(`/api/lists/${list.id}/items/${itemId}`, { method: 'DELETE' });
			if (res.ok || res.status === 204) {
				listItems = listItems.filter((item) => item.id !== itemId);
				products = products.filter((p) => String(p.id) !== productId);
				list = { ...list, productIds: list.productIds.filter((id) => String(id) !== productId) };
				syncListToStore();
			}
		} catch {}
	}

	async function handleStoreChange(storeId: number | null) {
		if (!list) return;

		const previousStoreId = selectedStoreId;
		selectedStoreId = storeId;

		try {
			const res = await fetch(`/api/lists/${list.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ selected_store_id: storeId })
			});

			if (!res.ok) {
				selectedStoreId = previousStoreId;
				return;
			}

			if (listItems.length > 0) {
				const productIds = listItems.map((item) => item.productId);
				const storeParam = storeId ? `&check_store=${storeId}` : '';
				const prodRes = await fetch(`/api/products?ids=${productIds.join(',')}${storeParam}`);

				if (prodRes.ok) {
					const data = await prodRes.json();
					const productMap = new Map<string, Product>();
					(data.products || []).forEach((p: Product) => productMap.set(String(p.id), p));

					listItems = listItems.map((item) => ({
						...item,
						product: productMap.get(item.productId) ?? item.product
					}));
				}
			}
		} catch {
			selectedStoreId = previousStoreId;
		}
	}

	function handleQuantityChange(itemId: string, delta: number) {
		const item = listItems.find((i) => i.id === itemId);
		if (!item) return;
		const newQty = Math.max(1, (item.quantity ?? 1) + delta);
		updateItemField(itemId, 'quantity', newQty);
	}

	function handleYearChange(itemId: string, year: number | null) {
		updateItemField(itemId, 'year', year);
	}

	function handleCreatedAtChange(itemId: string, date: string) {
		updateItemField(itemId, 'created_at', date);
	}

	function toggleNotes(itemId: string) {
		if (expandedNotes.has(itemId)) {
			expandedNotes.delete(itemId);
		} else {
			expandedNotes.add(itemId);
		}
		expandedNotes = new Set(expandedNotes);
	}

	function startEditNotes(itemId: string, currentNotes: string | null) {
		editingNotesId = itemId;
		notesValue = currentNotes ?? '';
	}

	async function saveNotes(itemId: string, notes: string) {
		await updateItemField(itemId, 'notes', notes || null);
		editingNotesId = null;
	}

	function handleDndConsider(e: CustomEvent<DndEvent<ListItemWithProduct>>) {
		items = e.detail.items;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<ListItemWithProduct>>) {
		items = e.detail.items;
		listItems = items.map((item) => ({ ...item }));
		if (!list) return;

		const orderedIds = items.map((item) => String(item.product?.id)).filter(Boolean);
		listsStore.reorderProducts(list.id, orderedIds);
		list = { ...list, productIds: orderedIds };

		try {
			const itemIds = items.map((item) => parseInt(item.id)).filter((id) => !isNaN(id));
			await fetch(`/api/lists/${list.id}/items/reorder`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ item_ids: itemIds })
			});
		} catch {}
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
	<div class="container mx-auto px-4 py-8 max-w-6xl" class:opacity-60={list.isPast}>
		<!-- Header -->
		<div class="mb-6">
			<div class="flex items-start justify-between gap-4 mb-2">
				<div class="flex items-center gap-3">
					<h1 class="text-3xl font-bold">{list.name}</h1>
					<ListTypeBadge listType={list.listType} size="md" />
					{#if list.isPast}
						<span class="badge badge-ghost">Passert</span>
					{/if}
				</div>
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

			{#if isEvent && list.eventDate}
				<div class="flex items-center gap-2 text-base-content/70 mb-2">
					<Calendar size={16} />
					<span>{formatLongDate(list.eventDate)}</span>
				</div>
			{/if}

			{#if isCellar && list.stats}
				<CellarStats stats={list.stats} />
			{/if}

			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-1 text-sm text-base-content/60">
					<Beer size={16} />
					<span>{getProductCountLabel(listItems.length)}</span>
				</div>
				{#if isShopping}
					<StoreSelector {selectedStoreId} onSelect={handleStoreChange} />
				{/if}
			</div>
		</div>

		<!-- Content -->
		{#if listItems.length === 0}
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
				class="space-y-2"
				use:dragHandleZone={{ items, flipDurationMs }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
			>
				{#each items as item, index (item.id)}
					<div animate:flip={{ duration: flipDurationMs }} class="group">
						<ListItemRow
							{item}
							listType={list.listType}
							{selectedStoreId}
							{index}
							expandedNotes={expandedNotes.has(item.id)}
							editingNotes={editingNotesId === item.id}
							{notesValue}
							onQuantityChange={handleQuantityChange}
							onYearChange={handleYearChange}
							onCreatedAtChange={handleCreatedAtChange}
							onRemove={removeItem}
							onToggleNotes={toggleNotes}
							onStartEditNotes={startEditNotes}
							onSaveNotes={saveNotes}
							onCancelEditNotes={() => (editingNotesId = null)}
							onNotesChange={(v) => (notesValue = v)}
						/>
					</div>
				{/each}
			</div>

			{#if isShopping && listItems.length > 0}
				<ShoppingTotalBar totalPrice={calculatedTotalPrice} {totalQuantity} />
			{/if}
		{/if}
	</div>
{/if}

<!-- Modals -->
<ListFormModal
	open={showEditModal}
	{list}
	onClose={() => (showEditModal = false)}
	onSave={handleSave}
	{isSaving}
/>

{#if list}
	<ShareModal
		open={showShareModal}
		listName={list.name}
		shareToken={list.shareToken}
		onClose={() => (showShareModal = false)}
	/>

	<ConfirmModal
		open={showDeleteConfirm}
		title="Slett liste"
		message={`Er du sikker på at du vil slette "${list.name}"? Dette kan ikke angres.`}
		confirmLabel="Slett"
		confirmClass="btn-error"
		isLoading={isDeleting}
		onConfirm={handleDelete}
		onCancel={() => (showDeleteConfirm = false)}
	/>
{/if}
