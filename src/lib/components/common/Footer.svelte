<script lang="ts">
	import { Beer } from '@lucide/svelte';
</script>

<footer class="footer footer-center p-10 bg-base-200 text-base-content mt-auto">
	<div>
		<Beer size={36} class="text-primary" />
		<p class="font-bold">
			Ølmonopolet <br />
		</p>
		<p>
			© {new Date().getFullYear()} Ølmonopolet. Alle rettigheter reservert.
		</p>
		<p class="opacity-70">Denne tjenesten er ikke tilknyttet Vinmonopolet.</p>
	</div>
</footer>
