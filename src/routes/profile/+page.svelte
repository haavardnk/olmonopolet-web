<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.svelte';
	import { ArrowLeft, Mail, Upload, LogOut, Trash2, CircleAlert } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let canGoBack = $state(false);
	let showLogoutModal = $state(false);
	let showDeleteModal = $state(false);
	let showReauthModal = $state(false);
	let deleting = $state(false);
	let deleteError = $state<string | null>(null);

	afterNavigate(({ from }) => {
		if (browser && from) canGoBack = true;
	});

	function goBack() {
		history.back();
	}

	$effect(() => {
		if (browser && !authStore.loading && !authStore.isAuthenticated) {
			goto('/login?redirect=/profile/');
		}
	});

	async function handleLogout() {
		await authStore.signOut();
		goto('/');
	}

	async function handleDelete() {
		deleting = true;
		deleteError = null;

		try {
			await authStore.deleteAccount();
			showDeleteModal = false;
			goto('/');
		} catch {
			showDeleteModal = false;
			showReauthModal = true;
		} finally {
			deleting = false;
		}
	}

	async function handleReauthGoogle() {
		deleting = true;
		deleteError = null;

		try {
			await authStore.reauthWithGoogle();
			await authStore.deleteAccount();
			showReauthModal = false;
			goto('/');
		} catch {
			deleteError = 'Kunne ikke bekrefte identitet. Prøv igjen.';
		} finally {
			deleting = false;
		}
	}

	async function handleReauthApple() {
		deleting = true;
		deleteError = null;

		try {
			await authStore.reauthWithApple();
			await authStore.deleteAccount();
			showReauthModal = false;
			goto('/');
		} catch {
			deleteError = 'Kunne ikke bekrefte identitet. Prøv igjen.';
		} finally {
			deleting = false;
		}
	}

	const initial = $derived(authStore.displayName ? authStore.displayName[0].toUpperCase() : '?');
</script>

<svelte:head>
	<title>Profil | Ølmonopolet</title>
</svelte:head>

<Header>
	{#snippet left()}
		{#if canGoBack}
			<button onclick={goBack} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
				<ArrowLeft size={16} />
				Tilbake
			</button>
		{/if}
	{/snippet}
</Header>

{#if authStore.isAuthenticated}
	<div class="flex-1 flex items-start justify-center p-4 pt-8">
		<div class="card bg-base-200 w-full max-w-md">
			<div class="card-body items-center text-center">
				<div class="avatar placeholder mb-2">
					<div
						class="bg-primary text-primary-content w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
					>
						{#if authStore.photoURL}
							<img
								src={authStore.photoURL}
								alt={authStore.displayName}
								referrerpolicy="no-referrer"
							/>
						{:else}
							<span class="text-3xl font-bold">{initial}</span>
						{/if}
					</div>
				</div>

				{#if authStore.displayName}
					<h2 class="text-xl font-bold">{authStore.displayName}</h2>
				{/if}
				{#if authStore.user?.email}
					<p class="text-sm text-base-content/60">{authStore.user.email}</p>
				{/if}

				<div class="divider text-xs uppercase tracking-wider text-base-content/50">
					Tilkoblede kontoer
				</div>

				<div class="w-full space-y-2">
					<div class="flex items-center justify-between px-2 py-2">
						<div class="flex items-center gap-3">
							<Mail size={18} class="text-base-content/60" />
							<span class="text-sm">E-post</span>
						</div>
						{#if authStore.hasEmailProvider}
							<span class="badge badge-success badge-sm">Tilkoblet</span>
						{:else}
							<span class="badge badge-ghost badge-sm">Ikke tilkoblet</span>
						{/if}
					</div>

					<div class="flex items-center justify-between px-2 py-2">
						<div class="flex items-center gap-3">
							<svg class="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							<span class="text-sm">Google</span>
						</div>
						{#if authStore.hasGoogleProvider}
							<span class="badge badge-success badge-sm">Tilkoblet</span>
						{:else}
							<span class="badge badge-ghost badge-sm">Ikke tilkoblet</span>
						{/if}
					</div>

					<div class="flex items-center justify-between px-2 py-2">
						<div class="flex items-center gap-3">
							<svg
								class="w-4.5 h-4.5"
								viewBox="0 0 24 24"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
								/>
							</svg>
							<span class="text-sm">Apple</span>
						</div>
						{#if authStore.hasAppleProvider}
							<span class="badge badge-success badge-sm">Tilkoblet</span>
						{:else}
							<span class="badge badge-ghost badge-sm">Ikke tilkoblet</span>
						{/if}
					</div>
				</div>

				<div class="divider text-xs uppercase tracking-wider text-base-content/50">Handlinger</div>

				<div class="w-full space-y-2">
					<a href="/import-tasted/" class="btn btn-ghost btn-block justify-start gap-3">
						<Upload size={18} />
						Importer Untappd-innsjekkinger
					</a>

					<button
						class="btn btn-ghost btn-block justify-start gap-3"
						onclick={() => (showLogoutModal = true)}
					>
						<LogOut size={18} />
						Logg ut
					</button>

					<button
						class="btn btn-error btn-outline btn-block justify-start gap-3"
						onclick={() => (showDeleteModal = true)}
					>
						<Trash2 size={18} />
						Slett konto
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<dialog class="modal" class:modal-open={showLogoutModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Logg ut</h3>
		<p class="py-4">Er du sikker på at du vil logge ut?</p>
		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => (showLogoutModal = false)}>Avbryt</button>
			<button class="btn btn-primary" onclick={handleLogout}>Logg ut</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showLogoutModal = false)}>close</button>
	</form>
</dialog>

<dialog class="modal" class:modal-open={showDeleteModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold text-error">Slett konto</h3>
		<p class="py-4">
			Er du sikker på at du vil slette kontoen din? Denne handlingen kan ikke angres.
		</p>
		<div class="modal-action">
			<button class="btn btn-ghost" disabled={deleting} onclick={() => (showDeleteModal = false)}>
				Avbryt
			</button>
			<button class="btn btn-error" disabled={deleting} onclick={handleDelete}>
				{#if deleting}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Slett
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showDeleteModal = false)}>close</button>
	</form>
</dialog>

<dialog class="modal" class:modal-open={showReauthModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold">Bekreft identitet</h3>
		<p class="py-4">Du må logge inn på nytt for å slette kontoen din.</p>

		{#if deleteError}
			<div class="alert alert-error mb-4">
				<CircleAlert size={20} />
				<span>{deleteError}</span>
			</div>
		{/if}

		<div class="flex flex-col gap-2">
			{#if authStore.hasGoogleProvider}
				<button class="btn btn-outline" disabled={deleting} onclick={handleReauthGoogle}>
					{#if deleting}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Bekreft med Google
				</button>
			{/if}
			{#if authStore.hasAppleProvider}
				<button class="btn btn-neutral" disabled={deleting} onclick={handleReauthApple}>
					{#if deleting}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Bekreft med Apple
				</button>
			{/if}
		</div>

		<div class="modal-action">
			<button
				class="btn btn-ghost"
				disabled={deleting}
				onclick={() => {
					showReauthModal = false;
					deleteError = null;
				}}
			>
				Avbryt
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button
			onclick={() => {
				showReauthModal = false;
				deleteError = null;
			}}>close</button
		>
	</form>
</dialog>
