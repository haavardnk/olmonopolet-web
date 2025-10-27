<script lang="ts">
	import { Search, X, ArrowDownNarrowWide, ArrowUpWideNarrow, Funnel } from '@lucide/svelte';
	import type { SortField } from '$lib/types';
	import { SORT_FIELD_LABELS } from '$lib/constants';

	let {
		searchQuery = $bindable(),
		sortBy = $bindable(),
		sortDescending = $bindable(),
		activeFiltersCount,
		onUpdate,
		onClearFilters,
		mobile = false,
		onOpenFilters
	}: {
		searchQuery: string;
		sortBy: SortField;
		sortDescending: boolean;
		activeFiltersCount: number;
		onUpdate: () => void;
		onClearFilters: () => void;
		mobile?: boolean;
		onOpenFilters?: () => void;
	} = $props();

	function clearSearch() {
		searchQuery = '';
		onUpdate();
	}

	function toggleSortDirection() {
		sortDescending = !sortDescending;
		onUpdate();
	}
</script>

{#if mobile}
	<div class="p-2">
		<div class="flex gap-2">
			<button
				onclick={onOpenFilters}
				class="btn btn-sm btn-square sm:btn-sm sm:w-24 relative"
				class:btn-primary={activeFiltersCount > 0}
				aria-label="Åpne filtre"
			>
				<Funnel size={18} />
				<span class="hidden sm:inline ml-1">Filtre</span>
				{#if activeFiltersCount > 0}
					<span
						class="badge badge-xs badge-accent absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
						>{activeFiltersCount}</span
					>
				{/if}
			</button>

			<label class="input input-sm flex items-center gap-2 flex-1">
				<Search size={16} class="text-base-content/50" />
				<input
					type="text"
					placeholder="Søk..."
					class="flex-1 text-sm"
					bind:value={searchQuery}
					onkeydown={(e) => e.key === 'Enter' && onUpdate()}
				/>
				{#if searchQuery}
					<button
						onclick={clearSearch}
						class="btn btn-ghost btn-xs btn-circle"
						aria-label="Tøm søk"
					>
						<X size={14} />
					</button>
				{/if}
			</label>

			<div class="join ml-auto">
				<select
					bind:value={sortBy}
					onchange={onUpdate}
					class="select select-sm join-item w-28 md:w-48"
				>
					{#each SORT_FIELD_LABELS as { value, label }}
						<option {value}>{label}</option>
					{/each}
				</select>
				<button
					onclick={toggleSortDirection}
					class="btn btn-sm btn-square join-item"
					aria-label={sortDescending ? 'Synkende' : 'Stigende'}
					title={sortDescending ? 'Synkende' : 'Stigende'}
				>
					{#if sortDescending}
						<ArrowDownNarrowWide size={16} />
					{:else}
						<ArrowUpWideNarrow size={16} />
					{/if}
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="sticky top-0 bg-base-200 border-b border-base-content/10 px-3 py-2 space-y-1.5 z-10">
		<div class="space-y-1 px-2">
			<div class="text-xs font-medium text-base-content/70">Søk</div>
			<label class="input input-sm flex items-center gap-2">
				<Search size={16} class="text-base-content/50" />
				<input
					type="text"
					placeholder="Søk etter produkt..."
					class="flex-1"
					bind:value={searchQuery}
					onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && onUpdate()}
				/>
				{#if searchQuery}
					<button
						onclick={clearSearch}
						class="btn btn-ghost btn-xs btn-circle"
						aria-label="Tøm søk"
					>
						<X size={14} />
					</button>
				{/if}
			</label>
		</div>

		<div class="space-y-1 px-2">
			<div class="text-xs font-medium text-base-content/70">Sorter etter</div>
			<div class="join flex">
				<select bind:value={sortBy} onchange={onUpdate} class="select select-sm join-item flex-1">
					{#each SORT_FIELD_LABELS as { value, label }}
						<option {value}>{label}</option>
					{/each}
				</select>
				<button
					onclick={toggleSortDirection}
					class="btn btn-sm btn-square join-item"
					aria-label={sortDescending ? 'Synkende' : 'Stigende'}
					title={sortDescending ? 'Synkende' : 'Stigende'}
				>
					{#if sortDescending}
						<ArrowDownNarrowWide size={16} />
					{:else}
						<ArrowUpWideNarrow size={16} />
					{/if}
				</button>
			</div>
		</div>

		{#if activeFiltersCount > 0}
			<div class="px-2">
				<button onclick={onClearFilters} class="btn btn-ghost btn-xs w-full justify-start">
					<X size={14} />
					Fjern alle filtre ({activeFiltersCount})
				</button>
			</div>
		{/if}
	</div>
{/if}
