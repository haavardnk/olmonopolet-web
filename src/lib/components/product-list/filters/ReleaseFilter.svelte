<script lang="ts">
	import { onMount } from 'svelte';
	import type { Release } from '$lib/types';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedReleases = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedReleases: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let releases = $state<Release[]>([]);
	let releasesLoading = $state(true);

	const releaseItems = $derived(
		releases.map((release) => ({ value: release.name, label: release.name }))
	);

	onMount(async () => {
		try {
			const response = await fetch('/api/releases');
			const data = await response.json();
			releases = data.releases || [];
		} catch (error) {
			console.error('Failed to fetch releases:', error);
			releases = [];
		} finally {
			releasesLoading = false;
		}
	});

	function handleReset() {
		selectedReleases = [];
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedReleases.indexOf(value);
		if (index > -1) {
			selectedReleases.splice(index, 1);
		} else {
			selectedReleases.push(value);
		}
		selectedReleases = [...selectedReleases];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Lansering"
	items={releaseItems}
	bind:selectedValues={selectedReleases}
	bind:isOpen
	isLoading={releasesLoading}
	loadingMessage="Laster lanseringer..."
	emptyMessage="Ingen lanseringer funnet"
	onReset={handleReset}
	onChange={handleChange}
/>
