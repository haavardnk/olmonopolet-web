<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Calendar } from '@lucide/svelte';

	export let release;
	export let i;
</script>

<div
	in:fly={{ y: 20, duration: 300, delay: i * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
>
	<div class="card-body p-3 md:p-4">
		<div class="flex flex-col md:flex-row justify-between gap-3 md:gap-4 items-start">
			<!-- Release Name and Date -->
			<div class="flex flex-col">
				<h3 class="card-title text-xl flex items-center gap-2">
					<Calendar size={18} class="text-primary" />
					{release.formatted_date}
				</h3>
			</div>
			<!-- Product Stats (top right) -->
			<div class="flex flex-wrap gap-3 md:gap-4 items-center md:mt-0 mt-2 self-start">
				<div class="flex items-center gap-1 text-sm">
					<div class="badge badge-neutral">
						{release.product_stats.product_count}
					</div>
					<span>Totalt</span>
				</div>
				<div class="flex items-center gap-1 text-sm">
					<div class="badge badge-primary">
						{release.product_stats.beer_count}
					</div>
					<span>Øl</span>
				</div>
				<div class="flex items-center gap-1 text-sm">
					<div class="badge badge-secondary">
						{release.product_stats.cider_count}
					</div>
					<span>Sider</span>
				</div>
				<div class="flex items-center gap-1 text-sm">
					<div class="badge badge-accent">
						{release.product_stats.mead_count}
					</div>
					<span>Mjød</span>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-end justify-between mt-4 min-h-[3.5rem] pb-1">
			<!-- Product Selections as Badges in lower left -->
			{#if Array.isArray(release.product_selections) && release.product_selections.length}
				<div class="flex flex-wrap gap-2">
					{#each release.product_selections as selection}
						<span class="badge badge-outline text-xs font-medium">
							{selection}
						</span>
					{/each}
				</div>
			{/if}
			<div class="card-actions">
				<a href={`/release/${release.name}`} class="btn btn-sm btn-primary"> Se detaljer </a>
			</div>
		</div>
	</div>
</div>
