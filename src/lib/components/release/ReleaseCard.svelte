<script lang="ts">
	import type { Release } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { Calendar } from '@lucide/svelte';
	import { slugify } from '$lib/utils/helpers';

	let { release, index }: { release: Release; index: number } = $props();
	const slug = $derived(slugify(release.name));
</script>

<a
	href="/release/{slug}"
	in:fly={{ y: 20, duration: 300, delay: index * 50 }}
	class="card bg-base-200 hover:shadow-lg transition-all hover:translate-y-[-2px] block no-underline"
>
	<div class="card-body p-3 md:p-4">
		<div class="flex flex-col md:flex-row justify-between gap-3 md:gap-4 items-start">
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2 flex-wrap">
					<h3 class="card-title text-xl flex items-center gap-2">
						<Calendar size={18} class="text-primary flex-shrink-0" />
						{release.formattedDate}
					</h3>
					{#if release.isChristmasRelease}
						<div class="badge badge-error gap-1 shadow-sm">
							<span>🎄</span>
							<span class="font-semibold">Juleøl</span>
						</div>
					{/if}
				</div>
			</div>
			<div
				class="flex items-center md:mt-0 mt-2 self-start overflow-x-auto pb-1 gap-2 md:gap-3 flex-shrink-0"
			>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-primary badge-sm sm:badge-md">
						{release.stats.productCount}
					</div>
					<span>Totalt</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-neutral badge-sm sm:badge-md">
						{release.stats.beerCount}
					</div>
					<span>Øl</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-success badge-sm sm:badge-md">
						{release.stats.ciderCount}
					</div>
					<span>Sider</span>
				</div>
				<div class="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap">
					<div class="badge badge-warning badge-sm sm:badge-md">
						{release.stats.meadCount}
					</div>
					<span>Mjød</span>
				</div>
			</div>
		</div>
		{#if Array.isArray(release.assortments) && release.assortments.length}
			<div class="flex flex-wrap gap-2 md:w-auto justify-start mt-4">
				{#each release.assortments as assortment}
					<span class="badge badge-sm sm:badge-md badge-outline">
						{assortment}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>
