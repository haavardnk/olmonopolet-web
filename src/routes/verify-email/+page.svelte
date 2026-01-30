<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.svelte';
	import { Mail, CircleCheck, CircleAlert, ArrowLeft, RefreshCw } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let resending = $state(false);
	let resendSuccess = $state(false);
	let checking = $state(false);
	let canGoBack = $state(false);

	afterNavigate(({ from }) => {
		if (browser && from) {
			canGoBack = true;
		}
	});

	function goBack() {
		history.back();
	}

	async function handleResend() {
		if (resending) return;

		resending = true;
		resendSuccess = false;
		authStore.clearError();

		try {
			await authStore.resendVerificationEmail();
			resendSuccess = true;
		} catch {
		} finally {
			resending = false;
		}
	}

	async function checkVerification() {
		if (checking) return;

		checking = true;

		try {
			await authStore.reloadUser();
			if (authStore.user?.emailVerified) {
				goto('/');
			}
		} finally {
			checking = false;
		}
	}

	$effect(() => {
		if (!authStore.loading) {
			if (!authStore.isAuthenticated) {
				goto('/login');
			} else if (authStore.user?.emailVerified) {
				goto('/');
			}
		}
	});
</script>

<svelte:head>
	<title>Bekreft e-post | Ølmonopolet</title>
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
		<div class="card-body text-center">
			<div class="flex justify-center mb-4">
				<div class="bg-primary/10 rounded-full p-4">
					<Mail size={48} class="text-primary" />
				</div>
			</div>

			<h1 class="card-title text-2xl justify-center mb-2">Bekreft e-postadressen din</h1>

			<p class="text-base-content/70 mb-6">
				Vi har sendt en bekreftelseslenke til
				<span class="font-medium text-base-content">{authStore.user?.email}</span>. Klikk på lenken
				i e-posten for å bekrefte kontoen din.
			</p>

			{#if resendSuccess}
				<div class="alert alert-success mb-4">
					<CircleCheck size={20} />
					<span>Ny bekreftelseslenke er sendt!</span>
				</div>
			{/if}

			{#if authStore.error}
				<div class="alert alert-error mb-4">
					<CircleAlert size={20} />
					<span>{authStore.error}</span>
				</div>
			{/if}

			<div class="space-y-3">
				<button onclick={checkVerification} class="btn btn-primary w-full" disabled={checking}>
					{#if checking}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<RefreshCw size={18} />
					{/if}
					Jeg har bekreftet e-posten
				</button>

				<button
					onclick={handleResend}
					class="btn btn-ghost w-full"
					disabled={resending || authStore.loading}
				>
					{#if resending}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Send bekreftelseslenke på nytt
				</button>
			</div>

			<div class="divider"></div>

			<p class="text-sm text-base-content/60">
				Finner du ikke e-posten? Sjekk spam-mappen eller
				<button onclick={handleResend} class="link link-primary" disabled={resending}>
					send på nytt
				</button>.
			</p>
		</div>
	</div>
</div>
