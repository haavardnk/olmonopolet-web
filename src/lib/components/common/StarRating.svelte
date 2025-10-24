<script lang="ts">
	import { Star, StarHalf } from '@lucide/svelte';
	import { getStarRating } from '$lib/utils';

	let {
		rating,
		size = 16,
		showValue = false,
		checkins = null
	}: {
		rating?: number | null;
		size?: number;
		showValue?: boolean;
		checkins?: number | null;
	} = $props();

	let normalizedRating = $derived(rating || 0);
	let stars = $derived(getStarRating(normalizedRating));
	let displayText = $derived.by(() => {
		if (normalizedRating === 0) {
			return 'Ingen vurderinger';
		}
		const ratingText = normalizedRating.toFixed(1);
		return checkins !== null ? `${ratingText} (${checkins})` : ratingText;
	});
</script>

<div class="flex items-center gap-1">
	{#each Array(stars.fullStars) as _}
		<Star {size} class="text-yellow-400 fill-yellow-400" />
	{/each}
	{#if stars.hasHalfStar}
		<StarHalf {size} class="text-yellow-400 fill-yellow-400" />
	{/if}
	{#each Array(stars.emptyStars) as _}
		<Star {size} class="text-gray-300" />
	{/each}
	{#if showValue}
		<span
			class="text-sm ml-1"
			class:opacity-60={normalizedRating === 0}
			class:opacity-80={normalizedRating > 0}
		>
			{displayText}
		</span>
	{/if}
</div>
