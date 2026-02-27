<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.svelte';
	import { tastedStore } from '$lib/stores/tasted.svelte';
	import { ArrowLeft, RefreshCw, Trash2, CircleAlert, CircleCheck, Info } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';
	import {
		getRssFeed,
		createRssFeed,
		updateRssFeed,
		deleteRssFeed,
		syncRssFeed,
		type RssFeed
	} from '$lib/api/rss';

	let { data } = $props();

	const isAuthenticated = $derived(authStore.isAuthenticated || !!data.user);

	let canGoBack = $state(false);
	let loading = $state(true);
	let saving = $state(false);
	let syncing = $state(false);
	let deleting = $state(false);
	let error = $state<string | null>(null);
	let success = $state<string | null>(null);
	let feed = $state<RssFeed | null>(null);
	let feedUrl = $state('');
	let showDeleteModal = $state(false);

	const isConfigured = $derived(feed !== null);

	afterNavigate(({ from }) => {
		if (browser && from) canGoBack = true;
	});

	$effect(() => {
		if (browser && !authStore.loading && !isAuthenticated) {
			goto('/login?redirect=/profile/rss/');
		}
	});

	$effect(() => {
		if (browser && isAuthenticated) {
			loadFeed();
		}
	});

	async function loadFeed() {
		loading = true;
		error = null;
		try {
			feed = await getRssFeed();
			if (feed) feedUrl = feed.feed_url;
		} catch {
			error = 'Kunne ikke laste RSS-innstillinger.';
		} finally {
			loading = false;
		}
	}

	async function handleSave() {
		if (!feedUrl.trim()) {
			error = 'Vennligst skriv inn en RSS-URL.';
			return;
		}

		saving = true;
		error = null;
		success = null;

		try {
			if (isConfigured) {
				feed = await updateRssFeed(feedUrl.trim(), feed!.active);
			} else {
				feed = await createRssFeed(feedUrl.trim());
			}
			feedUrl = feed.feed_url;
			success = isConfigured ? 'RSS-feed oppdatert.' : 'RSS-feed lagt til.';
		} catch (err: any) {
			error = err.message || 'Kunne ikke lagre RSS-feed.';
		} finally {
			saving = false;
		}
	}

	async function handleToggleActive() {
		if (!feed) return;

		saving = true;
		error = null;
		success = null;

		try {
			feed = await updateRssFeed(feed.feed_url, !feed.active);
			success = feed.active ? 'RSS-synkronisering aktivert.' : 'RSS-synkronisering deaktivert.';
		} catch (err: any) {
			error = err.message || 'Kunne ikke oppdatere status.';
		} finally {
			saving = false;
		}
	}

	async function handleSync() {
		syncing = true;
		error = null;
		success = null;

		try {
			const result = await syncRssFeed();
			if (result.imported > 0) {
				success = `Synkronisert ${result.imported} nye innsjekkinger.`;
			} else {
				success = 'Ingen nye innsjekkinger å synkronisere.';
			}
			tastedStore.clear();
			await loadFeed();
		} catch (err: any) {
			error = err.message || 'Synkronisering feilet.';
		} finally {
			syncing = false;
		}
	}

	async function handleDelete() {
		deleting = true;
		error = null;
		success = null;

		try {
			await deleteRssFeed();
			feed = null;
			feedUrl = '';
			showDeleteModal = false;
			success = 'RSS-feed fjernet.';
		} catch (err: any) {
			error = err.message || 'Kunne ikke fjerne RSS-feed.';
		} finally {
			deleting = false;
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'Aldri';
		return new Date(dateStr).toLocaleString('nb-NO', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Untappd RSS | Ølmonopolet</title>
</svelte:head>

<Header showUserMenu={true}>
	{#snippet right()}
		{#if canGoBack}
			<button onclick={() => history.back()} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
				<ArrowLeft size={16} />
				Tilbake
			</button>
		{:else}
			<a href="/profile/" class="btn btn-ghost btn-sm">
				<ArrowLeft size={16} />
				Profil
			</a>
		{/if}
	{/snippet}
</Header>

{#if !isAuthenticated}
	<div class="container mx-auto px-4 py-8 max-w-2xl">
		<div class="alert alert-warning">
			<CircleAlert size={20} />
			<span>Du må være innlogget for å konfigurere RSS-synkronisering.</span>
		</div>
	</div>
{:else if loading}
	<div class="flex-1 flex items-center justify-center p-8">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 max-w-2xl">
		<h1 class="text-3xl font-bold mb-6">Untappd RSS-synkronisering</h1>

		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h2 class="card-title text-lg">
					<Info size={20} />
					Slik finner du din RSS-feed
				</h2>
				<div class="space-y-3 text-sm">
					<div>
						<h3 class="font-semibold mb-1">Steg 1: Finn din RSS-URL</h3>
						<p class="text-xs opacity-70 mb-1">
							Gå til <a
								href="https://untappd.com/account/settings"
								target="_blank"
								rel="noopener"
								class="link">Untappd-innstillinger</a
							> og klikk på «View your RSS Feed». Kopier URL-en fra nettleseren.
						</p>
					</div>
					<div>
						<h3 class="font-semibold mb-1">Steg 2: Lim inn URL-en</h3>
						<p class="text-xs opacity-70">
							Lim inn URL-en i feltet under. Innsjekkinger synkroniseres automatisk.
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if error}
			<div class="alert alert-error mb-4">
				<CircleAlert size={20} />
				<span>{error}</span>
			</div>
		{/if}

		{#if success}
			<div class="alert alert-success mb-4">
				<CircleCheck size={20} />
				<span>{success}</span>
			</div>
		{/if}

		<div class="card bg-base-200">
			<div class="card-body">
				<div class="form-control">
					<label class="label" for="rss-url">
						<span class="label-text font-semibold">Untappd RSS-URL</span>
					</label>
					<input
						id="rss-url"
						type="url"
						placeholder="https://untappd.com/rss/user/dittbrukernavn"
						class="input input-bordered w-full"
						bind:value={feedUrl}
						disabled={saving}
					/>
				</div>

				<div class="flex gap-3 mt-4">
					<button class="btn btn-primary" disabled={saving || !feedUrl.trim()} onclick={handleSave}>
						{#if saving}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						{isConfigured ? 'Oppdater' : 'Lagre'}
					</button>
				</div>

				{#if isConfigured && feed}
					<div class="divider"></div>

					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold">Status</span>
							<div class="flex items-center gap-2">
								<span class="text-sm">{feed.active ? 'Aktiv' : 'Deaktivert'}</span>
								<input
									type="checkbox"
									class="toggle toggle-primary toggle-sm"
									checked={feed.active}
									disabled={saving}
									onchange={handleToggleActive}
								/>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold">Sist synkronisert</span>
							<span class="text-sm opacity-70">{formatDate(feed.last_synced)}</span>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold">Opprettet</span>
							<span class="text-sm opacity-70">{formatDate(feed.created_at)}</span>
						</div>
					</div>

					<div class="divider"></div>

					<div class="flex gap-3">
						<button
							class="btn btn-outline btn-sm"
							disabled={syncing || !feed.active}
							onclick={handleSync}
						>
							{#if syncing}
								<span class="loading loading-spinner loading-sm"></span>
								Synkroniserer...
							{:else}
								<RefreshCw size={16} />
								Synkroniser nå
							{/if}
						</button>

						<button
							class="btn btn-error btn-outline btn-sm"
							onclick={() => (showDeleteModal = true)}
						>
							<Trash2 size={16} />
							Fjern
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<dialog class="modal" class:modal-open={showDeleteModal}>
	<div class="modal-box">
		<h3 class="text-lg font-bold text-error">Fjern RSS-feed</h3>
		<p class="py-4">
			Er du sikker på at du vil fjerne RSS-feeden? Automatisk synkronisering av innsjekkinger
			stoppes.
		</p>
		<div class="modal-action">
			<button class="btn btn-ghost" disabled={deleting} onclick={() => (showDeleteModal = false)}>
				Avbryt
			</button>
			<button class="btn btn-error" disabled={deleting} onclick={handleDelete}>
				{#if deleting}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Fjern
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (showDeleteModal = false)}>close</button>
	</form>
</dialog>
