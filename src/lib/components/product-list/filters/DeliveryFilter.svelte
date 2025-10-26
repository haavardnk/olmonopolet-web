<script lang="ts">
	import { DELIVERY_OPTIONS } from '$lib/constants';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedDeliveryOptions = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedDeliveryOptions: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	const deliveryItems = $derived(
		DELIVERY_OPTIONS.map((option) => ({ value: option, label: option }))
	);

	function handleReset() {
		selectedDeliveryOptions = [];
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedDeliveryOptions.indexOf(value);
		if (index > -1) {
			selectedDeliveryOptions.splice(index, 1);
		} else {
			selectedDeliveryOptions.push(value);
		}
		selectedDeliveryOptions = [...selectedDeliveryOptions];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Leveringsmåte"
	items={deliveryItems}
	bind:selectedValues={selectedDeliveryOptions}
	bind:isOpen
	onReset={handleReset}
	onChange={handleChange}
/>
