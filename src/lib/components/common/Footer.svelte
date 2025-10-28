<script lang="ts">
	import {
		PUBLIC_SITE_TITLE,
		PUBLIC_PATREON_URL,
		PUBLIC_FACEBOOK_URL,
		PUBLIC_GITHUB_LINK,
		PUBLIC_GITHUB_LICENSE_LINK
	} from '$env/static/public';
	import { Beer, HeartHandshake, Facebook, Github } from '@lucide/svelte';
</script>

<footer class="footer footer-horizontal footer-center bg-base-200 text-base-content p-10 gap-6">
	<nav>
		<div class="grid grid-flow-col gap-4">
			<a href={PUBLIC_PATREON_URL} target="_blank" rel="noopener noreferrer" aria-label="Patreon">
				<HeartHandshake size={20} strokeWidth={2.5} />
			</a>
			<a href={PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
				<Facebook size={20} strokeWidth={2.5} />
			</a>
			<a href={PUBLIC_GITHUB_LINK} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Github size={20} strokeWidth={2.5} />
			</a>
		</div>
	</nav>
	<aside>
		<p class="text-sm">
			© {new Date().getFullYear()}
			{PUBLIC_SITE_TITLE}
		</p>
	</aside>
</footer>
