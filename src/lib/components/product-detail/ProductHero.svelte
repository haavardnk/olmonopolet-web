<script lang="ts">
	import { browser } from '$app/environment';
	import type { Product, UserList } from '$lib/types';
	import {
		ExternalLink,
		CircleCheck,
		Circle,
		ListPlus,
		Check,
		Plus,
		Loader2
	} from '@lucide/svelte';
	import StarRating from '$lib/components/common/StarRating.svelte';
	import Portal from '$lib/components/common/Portal.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { tastedStore } from '$lib/stores/tasted.svelte';
	import { listsStore } from '$lib/stores/lists.svelte';
	import { toggleTastedStatus } from '$lib/utils/tasted';
	import {
		fetchAndSetLists,
		toggleProductInList as toggleInList,
		isProductInList,
		getListCountForProduct,
		positionMenuFromButton
	} from '$lib/utils/lists';

	let { product }: { product: Product } = $props();

	const hasExternalLinks = $derived(product.vmpUrl || product.untappdUrl);

	let isTogglingTasted = $state(false);
	let localUserTasted = $state(false);
	let loadingListId = $state<string | null>(null);
	let isListOpen = $state(false);
	let listButtonEl = $state<HTMLButtonElement | null>(null);
	let menuPos = $state({ top: 0, left: 0 });

	const lists = $derived(listsStore.sortedLists);
	const listCount = $derived(getListCountForProduct(lists, product.id));

	$effect(() => {
		const storeState = tastedStore.getTasted(String(product.id));
		localUserTasted = storeState !== undefined ? storeState : product.userTasted || false;
	});

	$effect(() => {
		if (browser && authStore.isAuthenticated) fetchAndSetLists();
	});

	async function handleTastedToggle() {
		if (isTogglingTasted || !authStore.isAuthenticated) return;
		isTogglingTasted = true;
		await toggleTastedStatus(product.id, localUserTasted, (newState) => {
			localUserTasted = newState;
			product.userTasted = newState;
		});
		isTogglingTasted = false;
	}

	async function handleToggleInList(list: UserList) {
		loadingListId = list.id;
		await toggleInList(list.id, String(product.id), isProductInList(list, product.id));
		loadingListId = null;
	}

	function handleListClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		fetchAndSetLists();
		menuPos = positionMenuFromButton(listButtonEl);
		isListOpen = !isListOpen;
	}
</script>

<div>
	<h1 class="text-2xl sm:text-3xl font-bold text-base-content mb-1">{product.name}</h1>
	<p class="text-sm sm:text-lg text-base-content/70">{product.style || 'Øl'}</p>

	<div class="mt-2 flex items-center gap-1">
		<div class="flex items-center gap-1 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:sm:w-6 [&_svg]:sm:h-6">
			<StarRating rating={product.rating} size={20} showValue={false} />
		</div>
		<span class="text-sm sm:text-lg ml-1 opacity-80">
			{product.rating?.toFixed(1) || 'N/A'}
			{#if product.checkins}
				<span class="opacity-60">({product.checkins.toLocaleString()} vurderinger)</span>
			{/if}
		</span>
	</div>

	{#if hasExternalLinks}
		<div class="flex gap-2 mt-2 text-xs sm:text-sm">
			{#if product.vmpUrl}
				<a
					href={product.vmpUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
				>
					<ExternalLink size={14} />
					Vinmonopolet
				</a>
			{/if}
			{#if product.untappdUrl}
				<span class="opacity-50">•</span>
				<a
					href={product.untappdUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="link link-hover flex items-center gap-1 opacity-70 hover:opacity-100"
				>
					<ExternalLink size={14} />
					Untappd
				</a>
			{/if}
		</div>
	{/if}

	{#if authStore.isAuthenticated}
		<div class="mt-3 flex items-center gap-3">
			<div class="relative">
				<div class="join">
					<button
						type="button"
						onclick={handleTastedToggle}
						disabled={isTogglingTasted}
						class="btn btn-sm join-item gap-2 {localUserTasted
							? 'btn-success'
							: 'border-base-content/20'}"
						aria-label={localUserTasted ? 'Marker som ikke smakt' : 'Marker som smakt'}
					>
						{#if isTogglingTasted}
							<span class="loading loading-spinner loading-sm"></span>
						{:else if localUserTasted}
							<CircleCheck size={18} />
							<span>Smakt</span>
						{:else}
							<Circle size={18} />
							<span>Ikke smakt</span>
						{/if}
					</button>
					<button
						type="button"
						bind:this={listButtonEl}
						onclick={handleListClick}
						class="btn btn-sm join-item gap-2 border-base-content/20"
						aria-label="Legg til i liste"
						aria-expanded={isListOpen}
					>
						<ListPlus size={18} />
						<span>Lister</span>
					</button>
				</div>
				{#if listCount > 0}
					<span class="absolute -top-2 -right-2 z-10 badge badge-sm badge-secondary"
						>{listCount}</span
					>
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- List dropdown menu -->
{#if isListOpen}
	<Portal>
		<div
			class="fixed inset-0"
			style="z-index: 99998;"
			onclick={() => (isListOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (isListOpen = false)}
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
					{@const inList = isProductInList(list, product.id)}
					<li>
						<button
							type="button"
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
