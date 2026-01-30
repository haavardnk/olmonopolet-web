<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.svelte';
	import { Mail, Lock, CircleAlert, ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let canGoBack = $state(false);

	const redirectTo = $derived($page.url.searchParams.get('redirect') || '/');

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

		try {
			const user = await authStore.signIn(email, password);
			if (!user.emailVerified) {
				goto('/verify-email');
			} else {
				goto(redirectTo);
			}
		} catch {
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Logg inn | Ølmonopolet</title>
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
			<h1 class="card-title text-2xl justify-center mb-4">Logg inn</h1>

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

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Passord</span>
					</div>
					<label class="input input-bordered flex items-center gap-2 w-full">
						<Lock size={18} class="text-base-content/50" />
						<input
							type="password"
							bind:value={password}
							placeholder="••••••••"
							class="grow"
							required
							autocomplete="current-password"
						/>
					</label>
				</label>

				<div class="text-right">
					<a href="/forgot-password" class="link link-primary text-sm">Glemt passord?</a>
				</div>

				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={submitting || authStore.loading}
				>
					{#if submitting}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Logg inn
				</button>
			</form>

			<div class="divider">eller</div>

			<p class="text-center text-sm">
				Har du ikke en konto?
				<a href="/signup" class="link link-primary">Registrer deg</a>
			</p>
		</div>
	</div>
</div>
