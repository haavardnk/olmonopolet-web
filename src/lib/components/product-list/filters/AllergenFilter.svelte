<script lang="ts">
	import { ALLERGENS } from '$lib/constants/filters';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		allergenFilter = $bindable(''),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		allergenFilter: string;
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let selectedAllergens = $state<string[]>(parseSelectedAllergens(allergenFilter));

	const allergenItems = $derived(
		ALLERGENS.map((allergen) => ({ value: allergen.label, label: allergen.label }))
	);

	$effect(() => {
		selectedAllergens = parseSelectedAllergens(allergenFilter);
	});

	function parseSelectedAllergens(filterValue: string): string[] {
		if (!filterValue) return [];
		return ALLERGENS.filter((allergen) => {
			const keywords = allergen.value.split(',').map((k) => k.trim());
			return keywords.some((keyword) => filterValue.includes(keyword));
		}).map((allergen) => allergen.label);
	}

	function handleReset() {
		selectedAllergens = [];
		allergenFilter = '';
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedAllergens.indexOf(value);
		if (index > -1) {
			selectedAllergens.splice(index, 1);
		} else {
			selectedAllergens.push(value);
		}
		selectedAllergens = [...selectedAllergens];

		const allergenKeywords = selectedAllergens
			.map((label) => ALLERGENS.find((a) => a.label === label)?.value)
			.filter(Boolean)
			.join(',');
		allergenFilter = allergenKeywords;
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Uten allergener"
	items={allergenItems}
	bind:selectedValues={selectedAllergens}
	bind:isOpen
	onReset={handleReset}
	onChange={handleChange}
/>
