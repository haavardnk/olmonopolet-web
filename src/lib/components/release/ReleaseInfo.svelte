<script lang="ts">
	import type { Release } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { Calendar } from '@lucide/svelte';

	let { release }: { release: Release } = $props();
</script>

<div class="card bg-base-200 mb-8" in:fly={{ y: 20, duration: 300 }}>
	<div class="card-body">
		<div class="flex flex-col lg:hidden gap-4">
			<h1 class="text-xl font-bold flex items-center gap-3">
				<Calendar size={24} class="text-primary" />
				{release.formattedDate}
			</h1>
			{#if release.assortments && release.assortments.length > 0}
				<div>
					<h3 class="font-semibold mb-2">Produktutvalg:</h3>
					<div class="flex flex-wrap gap-2">
						{#each release.assortments as assortment}
							<span class="badge badge-sm badge-outline">{assortment}</span>
						{/each}
					</div>
				</div>
			{/if}
			<div class="flex flex-row flex-wrap gap-2 items-center">
				<div
					class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm"
				>
					<div class="font-semibold opacity-70">Totalt</div>
					<div class="font-bold text-base">{release.stats.productCount}</div>
				</div>
				{#if release.stats.beerCount}
					<div
						class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm"
					>
						<div class="font-semibold opacity-70">Øl</div>
						<div class="font-bold text-base">{release.stats.beerCount}</div>
					</div>
				{/if}
				{#if release.stats.ciderCount}
					<div
						class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm"
					>
						<div class="font-semibold opacity-70">Sider</div>
						<div class="font-bold text-base">{release.stats.ciderCount}</div>
					</div>
				{/if}
				{#if release.stats.meadCount}
					<div
						class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[60px] text-sm"
					>
						<div class="font-semibold opacity-70">Mjød</div>
						<div class="font-bold text-base">{release.stats.meadCount}</div>
					</div>
				{/if}
			</div>
		</div>

		<div class="hidden lg:flex lg:flex-col gap-6">
			<div class="flex justify-between items-center">
				<h1 class="text-3xl font-bold flex items-center gap-3">
					<Calendar size={32} class="text-primary" />
					{release.formattedDate}
				</h1>
				<div class="flex flex-row gap-2 items-center">
					<div class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]">
						<div class="font-semibold opacity-70">Totalt</div>
						<div class="font-bold text-2xl">{release.stats.productCount}</div>
					</div>
					{#if release.stats.beerCount}
						<div class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]">
							<div class="font-semibold opacity-70">Øl</div>
							<div class="font-bold text-2xl">{release.stats.beerCount}</div>
						</div>
					{/if}
					{#if release.stats.ciderCount}
						<div class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]">
							<div class="font-semibold opacity-70">Sider</div>
							<div class="font-bold text-2xl">{release.stats.ciderCount}</div>
						</div>
					{/if}
					{#if release.stats.meadCount}
						<div class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]">
							<div class="font-semibold opacity-70">Mjød</div>
							<div class="font-bold text-2xl">{release.stats.meadCount}</div>
						</div>
					{/if}
				</div>
			</div>

			{#if release.assortments && release.assortments.length > 0}
				<div>
					<div class="flex flex-wrap gap-2">
						{#each release.assortments as assortment}
							<span class="badge badge-md badge-outline">{assortment}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
