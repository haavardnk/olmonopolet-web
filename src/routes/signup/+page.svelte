<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.svelte';
	import { Mail, Lock, CircleAlert, CircleCheck, ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let submitting = $state(false);
	let passwordError = $state('');
	let canGoBack = $state(false);

	afterNavigate(({ from }) => {
		if (browser && from) {
			canGoBack = true;
		}
	});

	function goBack() {
		history.back();
	}

	function validatePassword() {
		if (password !== confirmPassword) {
			passwordError = 'Passordene må være like';
			return false;
		}
		if (password.length < 6) {
			passwordError = 'Passordet må være minst 6 tegn';
			return false;
		}
		passwordError = '';
		return true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (submitting) return;

		if (!validatePassword()) return;

		submitting = true;
		authStore.clearError();

		try {
			await authStore.signUp(email, password);
			goto('/verify-email');
		} catch {
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Registrer deg | Ølmonopolet</title>
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
			<h1 class="card-title text-2xl justify-center mb-4">Opprett konto</h1>

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
							placeholder="Minst 6 tegn"
							class="grow"
							required
							autocomplete="new-password"
							minlength="6"
						/>
					</label>
				</label>

				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Bekreft passord</span>
					</div>
					<label
						class="input input-bordered flex items-center gap-2 w-full"
						class:input-error={passwordError}
					>
						<CircleCheck size={18} class="text-base-content/50" />
						<input
							type="password"
							bind:value={confirmPassword}
							placeholder="Skriv passordet på nytt"
							class="grow"
							required
							autocomplete="new-password"
						/>
					</label>
					{#if passwordError}
						<div class="label">
							<span class="label-text-alt text-error">{passwordError}</span>
						</div>
					{/if}
				</label>

				<button
					type="submit"
					class="btn btn-primary w-full mt-4"
					disabled={submitting || authStore.loading}
				>
					{#if submitting}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Opprett konto
				</button>
			</form>

			<div class="divider">eller</div>

			<p class="text-center text-sm">
				Har du allerede en konto?
				<a href="/login" class="link link-primary">Logg inn</a>
			</p>
		</div>
	</div>
</div>
