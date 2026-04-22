<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';
	import { LogOut, LogIn, User, List, UserCircle } from '@lucide/svelte';

	const loginHref = $derived.by(() => {
		const current = $page.url.pathname + $page.url.search;
		return current && current !== '/' ? `/login?redirect=${encodeURIComponent(current)}` : '/login';
	});

	async function handleLogout() {
		await authStore.signOut();
		goto('/');
	}
</script>

{#if authStore.loading}
	<span class="loading loading-spinner loading-sm"></span>
{:else if authStore.isAuthenticated}
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-1">
			{#if authStore.photoURL}
				<div class="avatar">
					<div class="w-6 rounded-full">
						<img
							src={authStore.photoURL}
							alt={authStore.displayName}
							referrerpolicy="no-referrer"
						/>
					</div>
				</div>
			{:else}
				<User size={18} />
			{/if}
			<span class="hidden sm:inline text-sm max-w-28 truncate">{authStore.displayName}</span>
		</div>
		<ul
			tabindex="-1"
			class="dropdown-content menu bg-base-200 rounded-box z-50 w-64 p-2 shadow mt-3"
		>
			<li class="menu-title text-xs truncate px-2">{authStore.user?.email}</li>
			<li>
				<a href="/profile/">
					<UserCircle size={16} />
					Profil
				</a>
			</li>
			<li>
				<a href="/lists">
					<List size={16} />
					Mine lister
				</a>
			</li>
			<li>
				<button onclick={handleLogout} class="text-error">
					<LogOut size={16} />
					Logg ut
				</button>
			</li>
		</ul>
	</div>
{:else}
	<a href={loginHref} class="btn btn-ghost btn-sm gap-1">
		<LogIn size={18} />
		<span class="hidden sm:inline">Logg inn</span>
	</a>
{/if}
