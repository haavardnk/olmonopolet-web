<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  // Import Lucide icons
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
  } from "@lucide/svelte";

  // Mock data for beer releases with updated structure
  let releases = [
    {
      id: 1,
      date: "7. Mai 2025",
      selections: ["Basisutvalget", "Testutvalget"],
      stats: {
        total: 156,
        beers: 124,
        ciders: 18,
        meads: 14,
      },
    },
    {
      id: 2,
      date: "5. Februar 2025",
      selections: ["Tilleggsutvalget"],
      stats: {
        total: 87,
        beers: 72,
        ciders: 12,
        meads: 3,
      },
    },
    {
      id: 3,
      date: "30. Januar 2025",
      selections: ["Spesialutvalget"],
      stats: {
        total: 112,
        beers: 95,
        ciders: 10,
        meads: 7,
      },
    },
    {
      id: 4,
      date: "8. Januar 2025",
      selections: ["Basisutvalget"],
      stats: {
        total: 143,
        beers: 118,
        ciders: 15,
        meads: 10,
      },
    },
    {
      id: 5,
      date: "6. November 2024",
      selections: ["Spesialutvalget", "Basisutvalget"],
      stats: {
        total: 98,
        beers: 92,
        ciders: 4,
        meads: 2,
      },
    },
  ];

  let loading = false;
  let showSearch = false;

  function loadMore() {
    loading = true;

    // Simulate loading more data
    setTimeout(() => {
      const newReleases = [
        {
          id: 6,
          date: "15. September 2024",
          selections: ["Spesialutvalget"],
          stats: {
            total: 76,
            beers: 68,
            ciders: 6,
            meads: 2,
          },
        },
        {
          id: 7,
          date: "1. September 2024",
          selections: ["Basisutvalget", "Tilleggsutvalget"],
          stats: {
            total: 132,
            beers: 105,
            ciders: 22,
            meads: 5,
          },
        },
        {
          id: 8,
          date: "10. Juli 2024",
          selections: ["Spesialutvalget", "Testutvalget"],
          stats: {
            total: 64,
            beers: 48,
            ciders: 14,
            meads: 2,
          },
        },
      ];

      releases = [...releases, ...newReleases];
      loading = false;
    }, 800);
  }

  function toggleSearch() {
    showSearch = !showSearch;
  }

  // Set default theme on mount
  onMount(() => {
    // The theme-change package will handle the rest
  });
</script>

<svelte:head>
  <title>Ølmonopolet 2.0 | Beer Release Tracker</title>
</svelte:head>

<!-- Apply theme to the entire page -->
<div class="min-h-screen">
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
    <div class="hero py-12 bg-base-200" in:fade={{ duration: 300, delay: 150 }}>
      <div class="hero-content text-center">
        <div class="max-w-md">
          <!-- Centered beer icon with glow -->
          <div class="relative w-40 h-40 mx-auto mb-6">
            <div
              class="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            ></div>
            <div
              class="relative bg-base-300 rounded-full p-4 border-2 border-primary/50 flex items-center justify-center"
            >
              <Beer size={80} class="text-primary" />
            </div>
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
              href="#"
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
              href="#"
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
              href="#"
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

        <!-- Releases Cards -->
        <div class="grid gap-4">
          {#each releases as release, i (release.id)}
            <div
              in:fly={{ y: 20, duration: 300, delay: i * 100 }}
              class="card bg-base-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
            >
              <div class="card-body p-4">
                <div class="flex flex-col md:flex-row justify-between gap-4">
                  <!-- Date as Main Title -->
                  <h3 class="card-title text-xl flex items-center gap-2">
                    <Calendar size={18} class="text-primary" />
                    {release.date}
                  </h3>
                  <!-- Product Stats -->
                  <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex items-center gap-1 text-sm">
                      <div class="badge badge-neutral">
                        {release.stats.total}
                      </div>
                      <span>Totalt</span>
                    </div>

                    <div class="flex items-center gap-1 text-sm">
                      <div class="badge badge-primary">
                        {release.stats.beers}
                      </div>
                      <span>Øl</span>
                    </div>

                    <div class="flex items-center gap-1 text-sm">
                      <div class="badge badge-secondary">
                        {release.stats.ciders}
                      </div>
                      <span>Sider</span>
                    </div>

                    <div class="flex items-center gap-1 text-sm">
                      <div class="badge badge-accent">
                        {release.stats.meads}
                      </div>
                      <span>Mjød</span>
                    </div>
                  </div>
                </div>

                <!-- Product Selections as Subtitles -->
                <div class="mt-1">
                  <div class="flex flex-wrap gap-2">
                    {#each release.selections as selection}
                      <span class="text-sm font-medium opacity-80"
                        >{selection}</span
                      >
                      {#if release.selections.indexOf(selection) < release.selections.length - 1}
                        <span class="text-sm opacity-50">•</span>
                      {/if}
                    {/each}
                  </div>
                </div>

                <div class="card-actions justify-end mt-3">
                  <a
                    href={`/release/${release.id}`}
                    class="btn btn-sm btn-primary"
                  >
                    Les mer
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Load More Button -->
        <div class="flex justify-center mt-8">
          <button
            on:click={loadMore}
            class="btn btn-outline btn-wide"
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              LASTER...
            {:else}
              <Plus size={16} class="mr-1" />
              LAST INN MER
            {/if}
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
        Ølmonopolet <br />Finn det beste av øl, sider og mjød
      </p>
      <p>
        © {new Date().getFullYear()} Ølmonopolet. Alle rettigheter reservert.
      </p>
      <p class="opacity-70">Denne tjenesten er ikke tilknyttet Vinmonopolet.</p>
    </div>
    <div>
      <div class="grid grid-flow-col gap-4">
        <a href="https://twitter.com" class="btn btn-ghost btn-circle">
          <Twitter size={24} />
        </a>
        <a href="https://youtube.com" class="btn btn-ghost btn-circle">
          <Youtube size={24} />
        </a>
        <a href="https://facebook.com" class="btn btn-ghost btn-circle">
          <Facebook size={24} />
        </a>
      </div>
    </div>
  </footer>
</div>
