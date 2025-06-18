<script>
  import { fly } from "svelte/transition";
  import {
    Beer,
    Calendar,
    Menu,
    Play,
    Apple,
    Chrome,
    ExternalLink,
    Twitter,
    Youtube,
    Facebook,
    Plus,
    AlertCircle,
    RefreshCw,
  } from "@lucide/svelte";
  import hero from "$lib/assets/hero.svg";
  import Footer from "$lib/components/Footer.svelte";

  let { data } = $props();

  let releases = $state(data?.releases ? data.releases : []);
  let error = $state(data?.error || null);
  let visibleCount = $state(5);

  let visibleReleases = $derived(releases.slice(0, visibleCount));

  function loadMore() {
    visibleCount += 5;
  }

  function retryFetch() {
    location.reload();
  }
</script>

<svelte:head>
  <title>Ølmonopolet</title>
</svelte:head>

<div class="min-h-screen">
  <!-- Header -->
  <header
    class="sticky top-0 z-10 bg-base-300/80 backdrop-blur-md border-b border-base-content/10 shadow-md"
  >
    <div class="container mx-auto">
      <div class="navbar">
        <div class="navbar-start">
          <a href="/" class="flex items-center gap-2 text-xl font-medium">
            <span>Ølmonopolet</span>
          </a>
        </div>

        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1 gap-2">
            <li>
              <a
                href="https://patreon.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1"
              >
                Patreon
                <ExternalLink size={14} class="opacity-70" />
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1"
              >
                Facebook
                <ExternalLink size={14} class="opacity-70" />
              </a>
            </li>
          </ul>
        </div>

        <div class="navbar-end">
          <div class="dropdown dropdown-end md:hidden">
            <label class="btn btn-ghost btn-circle">
              <Menu size={24} />
            </label>
            <ul
              class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52"
            >
              <li>
                <a
                  href="https://patreon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Patreon
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="bg-base-100 text-base-content">
    <!-- Hero Section -->
    <div class="hero py-12 bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <!-- Centered beer icon with glow -->
          <div class="relative flex items-center justify-center">
            <img
              src={hero}
              alt="Ølmonopolet hero"
              class="w-56 h-56 object-contain"
            />
          </div>

          <h1 class="text-4xl font-bold mb-4">Ølmonopolet</h1>
          <p class="text-lg opacity-80 mb-8">
            Ølmonopolet er en tjeneste for å finne det beste av øl, sider og
            mjød på Vinmonopolet.
          </p>

          <!-- Centered Custom App Store Buttons -->
          <div
            class="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
          >
            <!-- Google Play Store Button -->
            <a
              href="https://patreon.com"
              class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
            >
              <div class="flex items-center gap-2">
                <Play
                  size={24}
                  class="text-primary group-hover:text-primary-content"
                />
                <div class="flex flex-col items-start">
                  <span class="text-xs opacity-80">LAST NED FRA</span>
                  <span class="font-bold text-sm">Google Play</span>
                </div>
              </div>
            </a>

            <!-- Apple App Store Button -->
            <a
              href="https://patreon.com"
              class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
            >
              <div class="flex items-center gap-2">
                <Apple
                  size={24}
                  class="text-primary group-hover:text-primary-content"
                />
                <div class="flex flex-col items-start">
                  <span class="text-xs opacity-80">LAST NED FRA</span>
                  <span class="font-bold text-sm">App Store</span>
                </div>
              </div>
            </a>

            <!-- Chrome Web Store Button -->
            <a
              href="https://patreon.com"
              class="btn btn-outline border-2 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300 group"
            >
              <div class="flex items-center gap-2">
                <Chrome
                  size={24}
                  class="text-primary group-hover:text-primary-content"
                />
                <div class="flex flex-col items-start">
                  <span class="text-xs opacity-80">TILGJENGELIG I</span>
                  <span class="font-bold text-sm">Chrome Store</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Releases Section -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
        >
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <Calendar size={24} class="text-primary" />
            Nyhetslanseringer
          </h2>
        </div>

        {#if error}
          <!-- Error State -->
          <div class="alert alert-error shadow-lg mb-8">
            <AlertCircle size={24} />
            <div>
              <h3 class="font-bold">Kunne ikke laste data</h3>
              <div class="text-xs">{error.message}</div>
            </div>
            <button class="btn btn-sm" onclick={retryFetch}>
              <RefreshCw size={16} />
              Prøv igjen
            </button>
          </div>
        {/if}

        {#if releases.length === 0 && !error}
          <!-- Empty State -->
          <div class="card bg-base-200 p-8 text-center">
            <div class="flex flex-col items-center gap-4">
              <Beer size={48} class="text-primary opacity-50" />
              <h3 class="font-bold text-lg">Ingen lanseringer funnet</h3>
              <p class="text-sm opacity-70">
                Det er ingen kommende lanseringer for øyeblikket.
              </p>
              <button class="btn btn-sm btn-outline mt-2" onclick={retryFetch}>
                <RefreshCw size={16} />
                Last inn på nytt
              </button>
            </div>
          </div>
        {:else}
          <!-- Releases Cards -->
          <div class="grid gap-4">
            {#each visibleReleases as release, i}
              <div
                in:fly={{ y: 20, duration: 300, delay: i * 50 }}
                class="card bg-base-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
              >
                <div class="card-body p-3 md:p-4">
                  <div
                    class="flex flex-col md:flex-row justify-between gap-3 md:gap-4 items-start"
                  >
                    <!-- Release Name and Date -->
                    <div class="flex flex-col">
                      <h3 class="card-title text-xl flex items-center gap-2">
                        <Calendar size={18} class="text-primary" />
                        {release.formatted_date}
                      </h3>
                    </div>
                    <!-- Product Stats (top right) -->
                    <div
                      class="flex flex-wrap gap-3 md:gap-4 items-center md:mt-0 mt-2 self-start"
                    >
                      <div class="flex items-center gap-1 text-sm">
                        <div class="badge badge-neutral">
                          {release.beer_count}
                        </div>
                        <span>Totalt</span>
                      </div>
                      <div class="flex items-center gap-1 text-sm">
                        <div class="badge badge-primary"></div>
                        <span>Øl</span>
                      </div>
                      <div class="flex items-center gap-1 text-sm">
                        <div class="badge badge-secondary"></div>
                        <span>Sider</span>
                      </div>
                      <div class="flex items-center gap-1 text-sm">
                        <div class="badge badge-accent"></div>
                        <span>Mjød</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="flex flex-row items-end justify-between mt-4 min-h-[3.5rem] pb-1"
                  >
                    <!-- Product Selections as Badges in lower left -->
                    {#if Array.isArray(release.product_selections) && release.product_selections.length}
                      <div class="flex flex-wrap gap-2">
                        {#each release.product_selections as selection}
                          <span class="badge badge-outline text-xs font-medium">
                            {selection}
                          </span>
                        {/each}
                      </div>
                    {/if}
                    <div class="card-actions">
                      <a
                        href={`/release/${release.name}`}
                        class="btn btn-sm btn-primary"
                      >
                        Se detaljer
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Pagination -->
          {#if releases.length > visibleCount}
            <div class="flex justify-center mt-8">
              <button onclick={loadMore} class="btn btn-outline btn-wide">
                <Plus size={16} class="mr-1" />
                LAST INN MER
              </button>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </main>

  <!-- Footer -->
  <Footer />
</div>
