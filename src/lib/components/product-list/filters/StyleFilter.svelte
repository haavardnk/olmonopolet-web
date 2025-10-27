<script lang="ts">
	import { onMount } from 'svelte';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';
	import type { FilterItem } from '$lib/types';

	let {
		selectedStyles = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedStyles: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let styles = $state<string[]>([]);
	let stylesLoading = $state(true);
	let styleSearchQuery = $state('');

	const filteredStyles = $derived(
		styles.filter((style) => style.toLowerCase().includes(styleSearchQuery.toLowerCase()))
	);

	const styleItems = $derived(filteredStyles.map((style) => ({ value: style, label: style })));

	onMount(async () => {
		try {
			const response = await fetch('/api/styles');
			const data = await response.json();
			styles = data.styles || [];
		} catch (error) {
			console.error('Failed to fetch styles:', error);
			styles = [];
		} finally {
			stylesLoading = false;
		}
	});

	function handleReset() {
		selectedStyles = [];
		styleSearchQuery = '';
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedStyles.indexOf(value);
		if (index > -1) {
			selectedStyles.splice(index, 1);
		} else {
			selectedStyles.push(value);
		}
		selectedStyles = [...selectedStyles];
		onFilterChange();
	}

	function handleSelectAllFiltered(items: FilterItem<string>[]) {
		const allFilteredValues = items.map((item) => item.value);
		const allSelected = allFilteredValues.every((value) => selectedStyles.includes(value));

		if (allSelected) {
			selectedStyles = selectedStyles.filter((style) => !allFilteredValues.includes(style));
		} else {
			selectedStyles = [...new Set([...selectedStyles, ...allFilteredValues])];
		}
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Stil"
	items={styleItems}
	bind:selectedValues={selectedStyles}
	bind:isOpen
	showSearch={true}
	bind:searchQuery={styleSearchQuery}
	isLoading={stylesLoading}
	loadingMessage="Laster stiler..."
	emptyMessage="Ingen stiler funnet"
	onReset={handleReset}
	onChange={handleChange}
	onSelectAllFiltered={handleSelectAllFiltered}
/>
