<script lang="ts">
	import { onMount } from 'svelte';
	import type { Country } from '$lib/types';
	import FilterCollapse from '$lib/components/product-list/controls/CollapseFilter.svelte';

	let {
		selectedCountries = $bindable(),
		isOpen = $bindable(false),
		onFilterChange
	}: {
		selectedCountries: string[];
		isOpen: boolean;
		onFilterChange: () => void;
	} = $props();

	let countries = $state<Country[]>([]);
	let countriesLoading = $state(true);
	let countrySearchQuery = $state('');

	const filteredCountries = $derived(
		countries.filter((country) =>
			country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
		)
	);

	const countryItems = $derived(
		filteredCountries.map((country) => ({ value: country.name, label: country.name }))
	);

	onMount(async () => {
		try {
			const response = await fetch('/api/countries');
			const data = await response.json();
			countries = data.countries || [];
		} catch (error) {
			console.error('Failed to fetch countries:', error);
			countries = [];
		} finally {
			countriesLoading = false;
		}
	});

	function handleReset() {
		selectedCountries = [];
		countrySearchQuery = '';
		onFilterChange();
	}

	function handleChange(value: string) {
		const index = selectedCountries.indexOf(value);
		if (index > -1) {
			selectedCountries.splice(index, 1);
		} else {
			selectedCountries.push(value);
		}
		selectedCountries = [...selectedCountries];
		onFilterChange();
	}
</script>

<FilterCollapse
	title="Land"
	items={countryItems}
	bind:selectedValues={selectedCountries}
	bind:isOpen
	showSearch={true}
	bind:searchQuery={countrySearchQuery}
	isLoading={countriesLoading}
	loadingMessage="Laster land..."
	emptyMessage="Ingen land funnet"
	onReset={handleReset}
	onChange={handleChange}
>
	{#snippet itemLabel(item)}
		{@const country = countries.find((c) => c.name === item.label)}
		<div class="flex items-center gap-2">
			{#if country?.iso_code}
				<span class="fi fi-{country.iso_code.toLowerCase()}"></span>
			{/if}
			<span class="text-xs">{item.label}</span>
		</div>
	{/snippet}
</FilterCollapse>
