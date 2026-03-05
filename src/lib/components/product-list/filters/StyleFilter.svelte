<script lang="ts">
	import { onMount } from 'svelte';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';
	import type { FilterItem } from '$lib/types';

	let {
		selectedStyles = $bindable(),
		isOpen = $bindable(false),
		selectedCategories = [],
		onFilterChange
	}: {
		selectedStyles: string[];
		isOpen: boolean;
		selectedCategories: string[];
		onFilterChange: () => void;
	} = $props();

	let styles = $state<string[]>([]);
	let stylesLoading = $state(true);
	let styleSearchQuery = $state('');

	function filterByCategory(allStyles: string[], categories: string[]): string[] {
		if (categories.length === 0) return allStyles;

		const result: string[] = [];
		for (const cat of categories) {
			if (cat === 'sider') {
				result.push(...allStyles.filter((s) => s.startsWith('Cider')));
			} else if (cat === 'mjød') {
				result.push(...allStyles.filter((s) => s.startsWith('Mead')));
			} else if (cat === 'øl') {
				result.push(...allStyles.filter((s) => !s.startsWith('Cider') && !s.startsWith('Mead')));
			}
		}
		return [...new Set(result)].sort((a, b) => a.localeCompare(b));
	}

	const categoryFilteredStyles = $derived(filterByCategory(styles, selectedCategories));

	const filteredStyles = $derived(
		categoryFilteredStyles.filter((style) =>
			style.toLowerCase().includes(styleSearchQuery.toLowerCase())
		)
	);

	const styleItems = $derived(filteredStyles.map((style) => ({ value: style, label: style })));

	$effect(() => {
		if (selectedCategories.length > 0 && selectedStyles.length > 0) {
			const valid = new Set(categoryFilteredStyles);
			const cleaned = selectedStyles.filter((s) => valid.has(s));
			if (cleaned.length !== selectedStyles.length) {
				selectedStyles = cleaned;
				onFilterChange();
			}
		}
	});

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
