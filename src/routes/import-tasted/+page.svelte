<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.svelte';
	import { tastedStore } from '$lib/stores/tasted.svelte';
	import { Upload, CircleCheck, CircleAlert, FileText, Info, ArrowLeft } from '@lucide/svelte';
	import Header from '$lib/components/common/Header.svelte';

	let files = $state<FileList | null>(null);
	let isUploading = $state(false);
	let error = $state<string | null>(null);
	let success = $state<{
		imported_count: number;
		total_check_ins: number;
		message?: string;
	} | null>(null);

	const selectedFile = $derived(files?.[0]);
	const fileSize = $derived(selectedFile ? (selectedFile.size / 1024).toFixed(2) + ' KB' : null);

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!selectedFile) {
			error = 'Vennligst velg en fil';
			return;
		}

		if (!selectedFile.name.endsWith('.json') && !selectedFile.name.endsWith('.csv')) {
			error = 'Kun JSON og CSV filer er støttet';
			return;
		}

		isUploading = true;
		error = null;
		success = null;

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);

			const response = await fetch('/api/tasted/bulk-import', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				let errorMessage = 'Failed to import';
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
				} catch {
					errorMessage = await response.text();
				}
				throw new Error(errorMessage);
			}

			const result = await response.json();
			success = result;

			tastedStore.clear();
			await invalidateAll();

			files = null;
		} catch (err: any) {
			error = err.message || 'En feil oppstod under import';
		} finally {
			isUploading = false;
		}
	}

	function resetForm() {
		files = null;
		error = null;
		success = null;
	}

	function goBack() {
		goto('/products');
	}
</script>

<Header showUserMenu={true}>
	{#snippet right()}
		<button onclick={goBack} class="btn btn-ghost btn-sm" aria-label="Gå tilbake">
			<ArrowLeft size={16} />
			Tilbake
		</button>
	{/snippet}
</Header>

{#if !authStore.isAuthenticated}
	<div class="container mx-auto px-4 py-8 max-w-2xl">
		<div class="alert alert-warning">
			<CircleAlert size={20} />
			<span>Du må være innlogget for å importere smakte øl.</span>
		</div>
		<div class="mt-4">
			<a href="/login" class="btn btn-primary">Logg inn</a>
		</div>
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 max-w-2xl">
		<h1 class="text-3xl font-bold mb-6">Importer fra Untappd</h1>

		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h2 class="card-title text-lg">
					<Info size={20} />
					Slik eksporterer du fra Untappd
				</h2>
				<div class="space-y-3 text-sm">
					<div>
						<h3 class="font-semibold mb-1">Steg 1: Eksporter data</h3>
						<p class="text-xs opacity-70 mb-2">
							<strong>Untappd Insider:</strong> Følg
							<a
								href="https://help.untappd.com/hc/en-us/articles/360034506171-Where-can-I-find-the-Exportable-Data-feature"
								target="_blank"
								rel="noopener"
								class="link">denne guiden</a
							> for å eksportere dine check-ins.
						</p>
						<p class="text-xs opacity-70">
							<strong>Vanlig bruker:</strong> Du må
							<a
								href="https://help.untappd.com/hc/en-us/requests/new"
								target="_blank"
								rel="noopener"
								class="link">kontakte Untappd support</a
							> for å be om eksport av dine data.
						</p>
					</div>
					<div>
						<h3 class="font-semibold mb-1">Steg 2: Last opp filen</h3>
						<p class="text-xs opacity-70">Last opp JSON eller CSV filen uten endringer.</p>
					</div>
				</div>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="form-control">
				<label class="label" for="file-upload">
					<span class="label-text font-semibold">Velg fil</span>
				</label>
				<input
					id="file-upload"
					type="file"
					accept=".json,.csv"
					class="file-input file-input-bordered file-input-primary w-full"
					bind:files
					disabled={isUploading}
				/>
				{#if selectedFile}
					<label class="label">
						<span class="label-text-alt flex items-center gap-2">
							<FileText size={14} />
							{fileSize}
						</span>
					</label>
				{/if}
			</div>

			{#if error}
				<div class="alert alert-error">
					<CircleAlert size={20} />
					<span>{error}</span>
				</div>
			{/if}

			{#if success}
				<div class="alert alert-success">
					<CircleCheck size={20} />
					<div class="flex flex-col">
						<span class="font-semibold">
							Vellykket importert {success.imported_count} øl fra {success.total_check_ins} check-ins!
						</span>
						{#if success.message}
							<span class="text-sm opacity-90">{success.message}</span>
						{/if}
					</div>
				</div>
			{/if}

			<div class="flex gap-3">
				<button type="submit" class="btn btn-primary" disabled={!selectedFile || isUploading}>
					{#if isUploading}
						<span class="loading loading-spinner loading-sm"></span>
						Importerer...
					{:else}
						<Upload size={18} />
						Importer
					{/if}
				</button>

				{#if selectedFile || error || success}
					<button type="button" class="btn btn-ghost" onclick={resetForm} disabled={isUploading}>
						Nullstill
					</button>
				{/if}
			</div>
		</form>
	</div>
{/if}
