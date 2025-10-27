<script lang="ts">
	const snowflakes = [
		{ top: 'top-12', left: 'left-6', size: 'text-xl', opacity: 'opacity-60' },
		{ top: 'top-8', left: 'left-1/4', size: 'text-lg', opacity: 'opacity-50' },
		{ top: 'top-7', right: 'right-1/4', size: 'text-base', opacity: 'opacity-55' },
		{ top: 'top-18', right: 'right-25', size: 'text-xl', opacity: 'opacity-65' },
		{ top: 'top-20', left: 'left-16', size: 'text-sm', opacity: 'opacity-45' },
		{ bottom: 'bottom-20', left: 'left-8', size: 'text-lg', opacity: 'opacity-50' },
		{ bottom: 'bottom-16', left: 'left-1/3', size: 'text-base', opacity: 'opacity-55' },
		{ bottom: 'bottom-11', right: 'right-1/2', size: 'text-xl', opacity: 'opacity-60' },
		{ bottom: 'bottom-12', right: 'right-12', size: 'text-lg', opacity: 'opacity-50' },
		{ bottom: 'bottom-20', right: 'right-8', size: 'text-sm', opacity: 'opacity-45' }
	];
</script>

{#each snowflakes as flake}
	<div
		class="absolute {flake.top || ''} {flake.bottom || ''} {flake.left || ''} {flake.right ||
			''} {flake.size} {flake.opacity} pointer-events-none"
	>
		❄️
	</div>
{/each}

<div class="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10">
	<svg viewBox="0 0 1200 80" preserveAspectRatio="none" class="w-full h-full drop-shadow-md">
		<path
			d="M0,30 Q30,10 60,30 T120,30 T180,30 T240,30 T300,30 T360,30 T420,30 T480,30 T540,30 T600,30 T660,30 T720,30 T780,30 T840,30 T900,30 T960,30 T1020,30 T1080,30 T1140,30 T1200,30 L1200,0 L0,0 Z"
			fill="#FFFFFF"
		/>
		<path
			d="M0,45 Q40,25 80,45 T160,45 T240,45 T320,45 T400,45 T480,45 T560,45 T640,45 T720,45 T800,45 T880,45 T960,45 T1040,45 T1120,45 T1200,45 L1200,0 L0,0 Z"
			fill="#F0F9FF"
		/>
	</svg>
</div>
