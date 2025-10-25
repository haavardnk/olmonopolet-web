<script lang="ts">
	import { X } from '@lucide/svelte';

	let {
		title,
		fromValue = $bindable(''),
		toValue = $bindable(''),
		unit = '',
		placeholder = '∞',
		min = 0,
		max,
		step = 1,
		onChange,
		onReset
	}: {
		title: string;
		fromValue?: string;
		toValue?: string;
		unit?: string;
		placeholder?: string;
		min?: number;
		max?: number;
		step?: number;
		onChange: () => void;
		onReset: () => void;
	} = $props();

	const hasValue = $derived(fromValue !== '' || toValue !== '');
</script>

<div class="bg-base-100 p-3 rounded-lg">
	<div class="flex items-center justify-between mb-2">
		<div class="text-sm font-medium">{title}</div>
		{#if hasValue}
			<button onclick={onReset} class="btn btn-ghost btn-xs" aria-label="Tilbakestill {title}">
				<X size={14} />
			</button>
		{/if}
	</div>
	<div class="grid grid-cols-2 gap-2">
		<label class="input input-sm flex items-center">
			<span class="text-xs text-base-content/70 mr-1">Fra:</span>
			<input
				type="number"
				placeholder="0"
				bind:value={fromValue}
				onchange={onChange}
				class="flex-1 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				{min}
				{max}
				{step}
			/>
			{#if unit}
				<span class="text-xs text-base-content/70 ml-1">{unit}</span>
			{/if}
		</label>
		<label class="input input-sm flex items-center">
			<span class="text-xs text-base-content/70 mr-1">Til:</span>
			<input
				type="number"
				{placeholder}
				bind:value={toValue}
				onchange={onChange}
				class="flex-1 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				{min}
				{max}
				{step}
			/>
			{#if unit}
				<span class="text-xs text-base-content/70 ml-1">{unit}</span>
			{/if}
		</label>
	</div>
</div>
