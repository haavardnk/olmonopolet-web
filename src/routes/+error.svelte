<script>
  import { Beer, ArrowLeft, RefreshCw } from "@lucide/svelte";
  import { page } from "$app/state";

  function retryFetch() {
    location.reload();
  }
  console.log(page);
</script>

<svelte:head>
  <title>Feil - Ølmonopolet</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
  <!-- Header -->
  <header
    class="sticky top-0 z-10 bg-base-300/80 backdrop-blur-md border-b border-base-content/10 shadow-md"
  >
    <div class="container mx-auto">
      <div class="navbar">
        <div class="navbar-start">
          <a href="/" class="flex items-center gap-2 text-xl font-medium">
            <Beer class="text-primary" size={24} />
            <span>Ølmonopolet</span>
          </a>
        </div>
        <div class="navbar-end">
          <a href="/" class="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />
            Tilbake
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Error Content -->
  <main class="bg-base-100 text-base-content flex-1">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-md mx-auto text-center">
        <Beer size={64} class="text-primary mx-auto mb-6 opacity-50" />

        <h1 class="text-4xl font-bold mb-2">{page.status || 500}</h1>

        <div class="text-xl mb-4">
          {page.error?.message || "Det oppstod en feil"}
        </div>

        {#if page.error?.details}
          <p class="text-base-content/70 mb-6">{page.error.details}</p>
        {/if}

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" class="btn btn-primary">
            <ArrowLeft size={16} />
            Tilbake til forsiden
          </a>

          <button onclick={retryFetch} class="btn btn-outline">
            <RefreshCw size={16} />
            Prøv igjen
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-10 bg-base-200 text-base-content">
    <div>
      <Beer size={36} class="text-primary" />
      <p class="font-bold">
        Ølmonopolet <br />
        Finn det beste av øl, sider og mjød
      </p>
      <p>
        © {new Date().getFullYear()} Ølmonopolet. Alle rettigheter reservert.
      </p>
      <p class="opacity-70">Denne tjenesten er ikke tilknyttet Vinmonopolet.</p>
    </div>
  </footer>
</div>
