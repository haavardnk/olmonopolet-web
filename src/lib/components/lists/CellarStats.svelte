<script lang="ts">
	import type { ListStats } from '$lib/types';
	import { formatCurrency } from '$lib/utils/formatters';

	type Props = {
		stats: ListStats;
		compact?: boolean;
	};

	let { stats, compact = false }: Props = $props();
</script>

<div class="stats stats-horizontal bg-base-200 shadow {compact ? '' : 'mb-4'}">
	<div class="stat {compact ? 'py-1 px-3' : 'py-2 px-4'}">
		<div class="stat-title {compact ? 'text-[10px]' : 'text-xs'}">Flasker</div>
		<div class="stat-value {compact ? 'text-base' : 'text-lg'}">{stats.totalBottles}</div>
	</div>
	{#if stats.totalValue}
		<div class="stat {compact ? 'py-1 px-3' : 'py-2 px-4'}">
			<div class="stat-title {compact ? 'text-[10px]' : 'text-xs'}">Verdi</div>
			<div class="stat-value {compact ? 'text-base' : 'text-lg'}">
				{formatCurrency(stats.totalValue)}
			</div>
		</div>
	{/if}
	{#if stats.oldestYear && stats.newestYear}
		<div class="stat {compact ? 'py-1 px-3' : 'py-2 px-4'}">
			<div class="stat-title {compact ? 'text-[10px]' : 'text-xs'}">Årganger</div>
			<div class="stat-value {compact ? 'text-base' : 'text-lg'}">
				{stats.oldestYear}-{stats.newestYear}
			</div>
		</div>
	{/if}
</div>
