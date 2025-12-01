<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	let isDark = $state(false);

	onMount(() => {
		themeChange(false);
		isDark = document.documentElement.getAttribute('data-theme') === 'ølmonopolet-dark';

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-theme') {
					isDark = document.documentElement.getAttribute('data-theme') === 'ølmonopolet-dark';
				}
			});
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => observer.disconnect();
	});
</script>

<label class="btn btn-ghost btn-sm btn-circle swap swap-rotate">
	<input type="checkbox" data-toggle-theme="ølmonopolet-dark,caramellatte" bind:checked={isDark} />
	<Sun class="swap-off size-5" />
	<Moon class="swap-on size-5" />
</label>
