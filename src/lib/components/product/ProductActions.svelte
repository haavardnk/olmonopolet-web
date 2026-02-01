<script lang="ts">
	import { browser } from '$app/environment';
	import { listsStore } from '$lib/stores/lists.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { tastedStore } from '$lib/stores/tasted.svelte';
	import { ListPlus, Check, Plus, Loader2, CircleCheck, Circle } from '@lucide/svelte';
	import type { UserList } from '$lib/types';
	import Portal from '$lib/components/common/Portal.svelte';
	import {
		fetchAndSetLists,
		toggleProductInList,
		isProductInList,
		getListCountForProduct,
		positionMenuFromButton
	} from '$lib/utils/lists';

	type Props = {
		productId: string;
		userTasted?: boolean;
		isTogglingTasted?: boolean;
		onTastedToggle?: (productId: string, currentState: boolean) => void;
		variant?: 'compact' | 'full';
	};

	let {
		productId,
		userTasted = false,
		isTogglingTasted = false,
		onTastedToggle,
		variant = 'compact'
	}: Props = $props();

	let loadingListId = $state<string | null>(null);
	let isOpen = $state(false);
	let buttonEl = $state<HTMLButtonElement | null>(null);
	let menuPos = $state({ top: 0, left: 0 });

	const lists = $derived(listsStore.sortedLists);
	const listCount = $derived(getListCountForProduct(lists, productId));

	const isTasted = $derived.by(() => {
		const storeState = tastedStore.getTasted(String(productId));
		return storeState !== undefined ? storeState : userTasted;
	});

	$effect(() => {
		if (browser && authStore.isAuthenticated) fetchAndSetLists();
	});

	async function handleToggleInList(list: UserList) {
		loadingListId = list.id;
		await toggleProductInList(list.id, String(productId), isProductInList(list, productId));
		loadingListId = null;
	}

	function handleTastedClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		onTastedToggle?.(productId, isTasted);
	}

	function handleListClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		fetchAndSetLists();
		menuPos = positionMenuFromButton(buttonEl);
		isOpen = !isOpen;
	}
</script>

{#if authStore.isAuthenticated}
	{#if variant === 'compact'}
		<div class="relative">
			<div class="join shadow-lg">
				<button
					type="button"
					onclick={handleTastedClick}
					disabled={isTogglingTasted}
					class="btn btn-sm btn-square join-item {isTasted
						? 'btn-success'
						: 'bg-base-100 border-base-content/20'}"
					aria-label={isTasted ? 'Marker som ikke smakt' : 'Marker som smakt'}
				>
					{#if isTogglingTasted}
						<span class="loading loading-spinner loading-xs"></span>
					{:else if isTasted}
						<CircleCheck size={16} />
					{:else}
						<Circle size={16} />
					{/if}
				</button>
				<button
					type="button"
					bind:this={buttonEl}
					onclick={handleListClick}
					class="btn btn-sm btn-square join-item bg-base-100 border-base-content/20"
					aria-label="Legg til i liste"
					aria-expanded={isOpen}
				>
					<ListPlus size={16} />
				</button>
			</div>
			{#if listCount > 0}
				<span class="absolute -top-1.5 -right-1.5 z-10 badge badge-xs badge-secondary"
					>{listCount}</span
				>
			{/if}
		</div>
	{:else}
		<div class="relative w-full">
			<div class="join w-full">
				<button
					type="button"
					onclick={handleTastedClick}
					disabled={isTogglingTasted}
					class="btn btn-xs join-item flex-1 {isTasted ? 'btn-success' : 'border-base-content/20'}"
					aria-label={isTasted ? 'Marker som ikke smakt' : 'Marker som smakt'}
				>
					{#if isTogglingTasted}
						<span class="loading loading-spinner loading-xs"></span>
					{:else if isTasted}
						<CircleCheck size={14} />
					{:else}
						<Circle size={14} />
					{/if}
				</button>
				<button
					type="button"
					bind:this={buttonEl}
					onclick={handleListClick}
					class="btn btn-xs join-item flex-1 border-base-content/20"
					aria-label="Legg til i liste"
					aria-expanded={isOpen}
				>
					<ListPlus size={14} />
				</button>
			</div>
			{#if listCount > 0}
				<span class="absolute -top-1.5 -right-1.5 z-10 badge badge-xs badge-secondary"
					>{listCount}</span
				>
			{/if}
		</div>
	{/if}
{/if}

{#if isOpen}
	<Portal>
		<div
			class="fixed inset-0"
			style="z-index: 99998;"
			onclick={() => (isOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
			role="presentation"
		></div>
		<ul
			class="menu bg-base-200 rounded-box w-56 p-2 shadow-xl fixed"
			style="z-index: 99999; top: {menuPos.top}px; left: {menuPos.left}px;"
			role="menu"
		>
			{#if listsStore.isLoading}
				<li class="text-center py-4">
					<span class="loading loading-spinner loading-sm"></span>
				</li>
			{:else if lists.length === 0}
				<li class="text-center py-2 text-sm text-base-content/70">
					<span>Ingen lister enda</span>
				</li>
				<li>
					<a href="/lists" class="justify-center text-primary">
						<Plus size={16} />
						Opprett liste
					</a>
				</li>
			{:else}
				{#each lists as list (list.id)}
					{@const inList = isProductInList(list, productId)}
					<li>
						<button
							onclick={(e) => {
								e.stopPropagation();
								handleToggleInList(list);
							}}
							disabled={loadingListId === list.id}
							class="flex justify-between"
						>
							<span class="truncate">{list.name}</span>
							{#if loadingListId === list.id}
								<Loader2 size={16} class="animate-spin" />
							{:else if inList}
								<Check size={16} class="text-success" />
							{/if}
						</button>
					</li>
				{/each}
				<li class="border-t border-base-300 mt-1 pt-1">
					<a href="/lists" class="text-sm text-base-content/70">Administrer lister</a>
				</li>
			{/if}
		</ul>
	</Portal>
{/if}
