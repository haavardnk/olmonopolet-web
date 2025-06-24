<script lang="ts">
	import { fly } from 'svelte/transition';
	import { Calendar } from '@lucide/svelte';
	import { slugify } from '$lib/utils';

	let { release, index } = $props();
	const slug = slugify(release.name);
</script>

<div
	in:fly={{ y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all hover:translate-y-[-2px]"
>
	<div class="card-body p-3 md:p-4">
		<div class="flex flex-col md:flex-row justify-between gap-3 md:gap-4 items-start">
			<div class="flex flex-col">
				<h3 class="card-title text-xl flex items-center gap-2">
					<Calendar size={18} class="text-primary flex-shrink-0" />
					{release.formatted_date}
				</h3>
			</div>
			<div
				class="flex items-center md:mt-0 mt-2 self-start overflow-x-auto pb-1 gap-2 md:gap-3 flex-shrink-0"
			>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-primary badge-sm sm:badge-md">
						{release.product_stats.product_count}
					</div>
					<span>Totalt</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-neutral badge-sm sm:badge-md">
						{release.product_stats.beer_count}
					</div>
					<span>Øl</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-success badge-sm sm:badge-md">
						{release.product_stats.cider_count}
					</div>
					<span>Sider</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-warning badge-sm sm:badge-md">
						{release.product_stats.mead_count}
					</div>
					<span>Mjød</span>
				</div>
			</div>
		</div>
		<div
			class="flex flex-col md:flex-row items-start md:items-end justify-between mt-4 min-h-[3.5rem] pb-1 gap-2"
		>
			{#if Array.isArray(release.product_selections) && release.product_selections.length}
				<div class="flex flex-wrap gap-2 md:w-auto justify-start">
					{#each release.product_selections as selection}
						<span class="badge badge-outline text-xs font-medium">
							{selection}
						</span>
					{/each}
				</div>
			{/if}
			<div class="card-actions w-full md:w-auto justify-end">
				<a href={`/release/${slug}`} class="btn btn-sm btn-neutral w-full md:w-auto">
					Se detaljer
				</a>
			</div>
		</div>
	</div>
</div>
