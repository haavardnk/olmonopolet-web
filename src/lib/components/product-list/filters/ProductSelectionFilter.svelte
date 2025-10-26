<script lang="ts">
	import { PRODUCT_SELECTIONS } from '$lib/constants';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedProductSelections = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedProductSelections: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	const productSelectionItems = $derived(
		PRODUCT_SELECTIONS.map((selection) => ({ value: selection.value, label: selection.label }))
	);

	function handleReset() {
		selectedProductSelections = [];
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedProductSelections.indexOf(value);
		if (index > -1) {
			selectedProductSelections.splice(index, 1);
		} else {
			selectedProductSelections.push(value);
		}
		selectedProductSelections = [...selectedProductSelections];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Produktutvalg"
	items={productSelectionItems}
	bind:selectedValues={selectedProductSelections}
	bind:isOpen
	onReset={handleReset}
	onChange={handleChange}
/>
