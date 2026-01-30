<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.svelte';
	import { Mail, CircleAlert, CircleCheck, ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let email = $state('');
	let submitting = $state(false);
	let success = $state(false);
	let canGoBack = $state(false);

	afterNavigate(({ from }) => {
		if (browser && from) {
			canGoBack = true;
		}
	});

	function goBack() {
		history.back();
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (submitting) return;

		submitting = true;
		authStore.clearError();
		success = false;

		try {
			await authStore.resetPassword(email);
			success = true;
		} catch {
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Glemt passord | Ølmonopolet</title>
</svelte:head>

<Header showUserMenu={false}>
	{#snippet right()}
		{#if canGoBack}
			<button onclick={goBack} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
				<ArrowLeft size={16} />
				Tilbake
			</button>
		{/if}
	{/snippet}
</Header>

<div class="flex-1 flex items-center justify-center p-4">
	<div class="card bg-base-200 w-full max-w-md">
		<div class="card-body">
			<h1 class="card-title text-2xl justify-center mb-4">Tilbakestill passord</h1>

			{#if success}
				<div class="alert alert-success mb-4">
					<CircleCheck size={20} />
					<span>Vi har sendt deg en e-post med instruksjoner for å tilbakestille passordet.</span>
				</div>

				<a href="/login" class="btn btn-primary w-full">Tilbake til innlogging</a>
			{:else}
				<p class="text-base-content/70 text-sm mb-4 text-center">
					Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
				</p>

				{#if authStore.error}
					<div class="alert alert-error mb-4">
						<CircleAlert size={20} />
						<span>{authStore.error}</span>
					</div>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-5">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">E-post</span>
						</div>
						<label class="input input-bordered flex items-center gap-2 w-full">
							<Mail size={18} class="text-base-content/50" />
							<input
								type="email"
								bind:value={email}
								placeholder="din@epost.no"
								class="grow"
								required
								autocomplete="email"
							/>
						</label>
					</label>

					<button
						type="submit"
						class="btn btn-primary w-full mt-4"
						disabled={submitting || authStore.loading}
					>
						{#if submitting}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						Send tilbakestillingslenke
					</button>
				</form>

				<div class="divider"></div>

				<p class="text-center text-sm">
					<a href="/login" class="link link-primary">Tilbake til innlogging</a>
				</p>
			{/if}
		</div>
	</div>
</div>
