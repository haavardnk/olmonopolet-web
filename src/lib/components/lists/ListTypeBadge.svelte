<script lang="ts">
	import type { UserList } from '$lib/types';
	import { ShoppingCart, Wine, Calendar, EyeOff, CloudDownload, Bookmark } from '@lucide/svelte';
	import { matchPreset } from '$lib/utils/list-types';

	type Props = {
		list: UserList;
		size?: 'sm' | 'md';
	};

	let { list, size = 'sm' }: Props = $props();

	const isUntappd = $derived(list.untappdListId != null);
	const isFollowed = $derived(!!list.isFollowed);
	const preset = $derived(
		matchPreset({
			showQuantity: list.showQuantity,
			showStore: list.showStore,
			showVintage: list.showVintage,
			showPrices: list.showPrices,
			showNotes: list.showNotes
		})
	);
	const iconSize = $derived(size === 'sm' ? 12 : 14);
</script>

{#if isFollowed}
	<span class="badge {size === 'sm' ? 'badge-sm' : ''} badge-ghost text-base-content/70 gap-1">
		<Bookmark size={iconSize} />
		Følger
	</span>
{:else if isUntappd}
	<span class="badge {size === 'sm' ? 'badge-sm' : ''} badge-ghost text-base-content/70 gap-1">
		<CloudDownload size={iconSize} />
		Untappd
	</span>
{:else if preset && preset.id !== 'simple'}
	{@const Icon = preset.icon}
	<span class="badge {size === 'sm' ? 'badge-sm' : ''} badge-ghost text-base-content/70 gap-1">
		<Icon size={iconSize} />
		{preset.label}
	</span>
{:else if !preset}
	<span class="badge {size === 'sm' ? 'badge-sm' : ''} badge-ghost text-base-content/70 gap-1">
		{#if list.showStore}
			<ShoppingCart size={iconSize} />
		{/if}
		{#if list.showVintage}
			<Wine size={iconSize} />
		{/if}
		{#if !list.showPrices}
			<EyeOff size={iconSize} />
		{/if}
		{#if list.eventDate}
			<Calendar size={iconSize} />
		{/if}
		Tilpasset
	</span>
{/if}
