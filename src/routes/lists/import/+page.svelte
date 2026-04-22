<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { UntappdListSearchResult, ApiUserList } from '$lib/types';

	let { data } = $props();

	const isAuthenticated = $derived(authStore.isAuthenticated || !!data.user);
	import Header from '$lib/components/common/Header.svelte';
	import { transformApiList } from '$lib/utils/lists';
	import { listsStore } from '$lib/stores/lists.svelte';
	import { ArrowLeft, CircleAlert, Search, ExternalLink, Info } from '@lucide/svelte';

	let username = $state('');
	let results = $state<UntappdListSearchResult[]>([]);
	let isSearching = $state(false);
	let searchError = $state<string | null>(null);
	let hasSearched = $state(false);
	let subscribingId = $state<number | null>(null);

	async function handleSearch() {
		const trimmed = username.trim();
		if (!trimmed) return;

		isSearching = true;
		searchError = null;
		results = [];
		hasSearched = false;

		try {
			const res = await fetch(`/api/untappd-lists/search?username=${encodeURIComponent(trimmed)}`);
			if (res.status === 404) {
				searchError = 'Bruker ikke funnet eller profilen er privat';
				return;
			}
			if (!res.ok) {
				searchError = 'Kunne ikke søke etter lister. Prøv igjen senere.';
				return;
			}
			results = await res.json();
			hasSearched = true;
		} catch {
			searchError = 'Kunne ikke søke etter lister. Prøv igjen senere.';
		} finally {
			isSearching = false;
		}
	}

	async function handleSubscribe(item: UntappdListSearchResult) {
		subscribingId = item.list_id;
		try {
			const res = await fetch('/api/untappd-lists/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					untappd_list_id: item.list_id,
					untappd_username: username.trim(),
					name: item.name
				})
			});
			if (!res.ok) throw new Error();
			const data: ApiUserList = await res.json();
			const userList = transformApiList(data);
			listsStore.addList(userList);
			goto(`/lists/${userList.id}`);
		} catch {
			searchError = 'Kunne ikke abonnere på listen. Prøv igjen senere.';
		} finally {
			subscribingId = null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSearch();
	}
</script>

<Header showUserMenu={true}>
	{#snippet right()}
		<button onclick={() => goto('/lists')} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
			<ArrowLeft size={16} />
			Tilbake
		</button>
	{/snippet}
</Header>

{#if !isAuthenticated && !authStore.loading}
	<div class="container mx-auto px-4 py-16 max-w-md text-center">
		<CircleAlert size={48} class="mx-auto mb-4 text-warning" />
		<h1 class="text-2xl font-bold mb-2">Logg inn for å importere lister</h1>
		<p class="text-base-content/70 mb-6">
			Du må være logget inn for å importere lister fra Untappd.
		</p>
		<a href="/login?redirect=/lists/import/" class="btn btn-primary">Logg inn</a>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 max-w-2xl">
		<h1 class="text-3xl font-bold mb-6">Importer fra Untappd</h1>

		<div class="form-control mb-6">
			<label class="label" for="untappd-username">
				<span class="label-text">Untappd brukernavn</span>
			</label>
			<div class="join w-full">
				<input
					id="untappd-username"
					type="text"
					class="input input-bordered join-item flex-1"
					bind:value={username}
					onkeydown={handleKeydown}
					placeholder="brukernavn"
					disabled={isSearching}
				/>
				<button
					class="btn btn-primary join-item"
					onclick={handleSearch}
					disabled={isSearching || !username.trim()}
				>
					{#if isSearching}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<Search size={18} />
					{/if}
					Søk
				</button>
			</div>
		</div>

		{#if searchError}
			<div class="alert alert-error mb-4">
				<CircleAlert size={20} />
				<span>{searchError}</span>
			</div>
		{/if}

		{#if hasSearched}
			{#if results.length === 0}
				<p class="text-base-content/70 text-center py-8">Ingen offentlige lister funnet.</p>
			{:else}
				<div class="alert alert-info mb-4">
					<Info size={20} />
					<span>Kun produkter som også finnes på Vinmonopolet blir synkronisert.</span>
				</div>

				<div class="space-y-2">
					{#each results as item (item.list_id)}
						<div class="card bg-base-200 shadow-sm">
							<div class="card-body p-4 flex-row items-center justify-between gap-4">
								<div class="min-w-0">
									<h3 class="font-semibold line-clamp-1">{item.name}</h3>
									<p class="text-sm text-base-content/60">
										{item.item_count}
										{item.item_count === 1 ? 'produkt' : 'produkter'}
									</p>
								</div>
								<button
									class="btn btn-primary btn-sm shrink-0"
									onclick={() => handleSubscribe(item)}
									disabled={subscribingId !== null}
								>
									{#if subscribingId === item.list_id}
										<span class="loading loading-spinner loading-sm"></span>
									{:else}
										<ExternalLink size={16} />
									{/if}
									Abonner
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
{/if}
