<script lang="ts">
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';
	import type { FilterItem } from '$lib/types';

	let {
		selectedCategories = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedCategories: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	const categories: FilterItem<string>[] = [
		{ value: 'øl', label: 'Øl' },
		{ value: 'mjød', label: 'Mjød' },
		{ value: 'sider', label: 'Sider' }
	];

	function handleReset() {
		selectedCategories = [];
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedCategories.indexOf(value);
		if (index > -1) {
			selectedCategories.splice(index, 1);
		} else {
			selectedCategories.push(value);
		}
		selectedCategories = [...selectedCategories];
		onFilterChange();
	}

	function handleSelectAllFiltered(items: FilterItem<string>[]) {
		const allFilteredValues = items.map((item) => item.value);
		const allSelected = allFilteredValues.every((value) => selectedCategories.includes(value));

		if (allSelected) {
			selectedCategories = selectedCategories.filter(
				(category) => !allFilteredValues.includes(category)
			);
		} else {
			selectedCategories = [...new Set([...selectedCategories, ...allFilteredValues])];
		}
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Kategori"
	items={categories}
	bind:selectedValues={selectedCategories}
	bind:isOpen
	showSearch={false}
	onReset={handleReset}
	onChange={handleChange}
	onSelectAllFiltered={handleSelectAllFiltered}
/>
