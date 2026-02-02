<script lang="ts">
	import type { ListType } from '$lib/types';
	import { getListTypeConfig, isTypedList } from '$lib/utils/list-types';

	type Props = {
		listType: ListType | null | undefined;
		size?: 'sm' | 'md';
		showIcon?: boolean;
	};

	let { listType, size = 'sm', showIcon = true }: Props = $props();

	const config = $derived(getListTypeConfig(listType));
	const Icon = $derived(config.icon);
	const shouldShow = $derived(isTypedList(listType));
</script>

{#if shouldShow}
	<span class="badge {size === 'sm' ? 'badge-sm' : ''} badge-ghost text-base-content/70 gap-1">
		{#if showIcon}
			<Icon size={size === 'sm' ? 12 : 14} />
		{/if}
		{config.label}
	</span>
{/if}
