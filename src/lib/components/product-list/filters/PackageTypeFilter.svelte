<script lang="ts">
	import { PACKAGE_TYPES } from '$lib/constants';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedPackageTypes = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedPackageTypes: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	const packageTypeItems = PACKAGE_TYPES.map((type) => ({ value: type.value, label: type.label }));

	function handleReset() {
		selectedPackageTypes = [];
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedPackageTypes.indexOf(value);
		if (index > -1) {
			selectedPackageTypes.splice(index, 1);
		} else {
			selectedPackageTypes.push(value);
		}
		selectedPackageTypes = [...selectedPackageTypes];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Emballasje"
	items={packageTypeItems}
	bind:selectedValues={selectedPackageTypes}
	bind:isOpen
	onReset={handleReset}
	onChange={handleChange}
/>
