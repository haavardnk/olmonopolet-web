<script lang="ts">
	import type { PatreonPost } from '$lib/api/patreon';
	import { browser } from '$app/environment';
	import {
		PUBLIC_SITE_TITLE,
		PUBLIC_PATREON_URL,
		PUBLIC_FACEBOOK_URL,
		PUBLIC_GITHUB_LINK,
		PUBLIC_GITHUB_LICENSE_LINK
	} from '$env/static/public';
	import { HeartHandshake, Facebook, Github } from '@lucide/svelte';
	import { format, parseISO } from 'date-fns';
	import { nb } from 'date-fns/locale';

	let patreonPosts: PatreonPost[] = $state([]);

	$effect(() => {
		if (!browser) return;
		fetch('/api/patreon/')
			.then((res) => (res.ok ? res.json() : []))
			.then((posts) => (patreonPosts = posts))
			.catch(() => (patreonPosts = []));
	});

	function formatShortDate(dateString: string | null): string {
		if (!dateString) return '';
		try {
			return format(parseISO(dateString), 'dd.MM.yy', { locale: nb });
		} catch {
			return '';
		}
	}
</script>

<footer class="bg-base-200 text-base-content">
	<div class="max-w-4xl mx-auto px-4 pt-10 pb-6">
		{#if patreonPosts.length > 0}
			<div>
				<a
					href={PUBLIC_PATREON_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-bold uppercase tracking-wider text-base-content/50 mb-3 flex items-center gap-1.5 hover:text-primary transition-colors w-fit"
				>
					<HeartHandshake size={14} strokeWidth={2.5} />
					Siste fra Patreon
				</a>
				<ul class="space-y-1.5">
					{#each patreonPosts.slice(0, 5) as post (post.id)}
						<li>
							<a
								href={post.url}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-baseline gap-2 text-sm hover:text-primary transition-colors"
							>
								<span class="text-xs text-base-content/30 tabular-nums shrink-0">
									{formatShortDate(post.publishedAt)}
								</span>
								<span class="line-clamp-1 group-hover:underline underline-offset-2">
									{post.title}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="divider my-4"></div>

		<div class="flex flex-col items-center gap-3">
			<nav class="flex gap-3">
				<a
					href={PUBLIC_PATREON_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost btn-sm btn-circle hover:text-primary"
					aria-label="Patreon"
				>
					<HeartHandshake size={18} strokeWidth={2.5} />
				</a>
				<a
					href={PUBLIC_FACEBOOK_URL}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost btn-sm btn-circle hover:text-primary"
					aria-label="Facebook"
				>
					<Facebook size={18} strokeWidth={2.5} />
				</a>
				<a
					href={PUBLIC_GITHUB_LINK}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost btn-sm btn-circle hover:text-primary"
					aria-label="GitHub"
				>
					<Github size={18} strokeWidth={2.5} />
				</a>
			</nav>
			<p class="text-xs text-base-content/40">
				&copy; {new Date().getFullYear()}
				{PUBLIC_SITE_TITLE}
			</p>
		</div>
	</div>
</footer>
