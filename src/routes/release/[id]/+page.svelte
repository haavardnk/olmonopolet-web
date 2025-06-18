<script>
  import { fly } from "svelte/transition";
  import { Beer, Calendar, ArrowLeft, RefreshCw } from "@lucide/svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import orderBy from "lodash/orderBy";
  import Footer from "$lib/components/Footer.svelte";

  let { data } = $props();

  let release = $state(data.release);
  let sortKey = $state("rating");
  let sortOrder = $state("desc");

  let sortedProducts = $derived(
    orderBy(release.products, [sortKey], [sortOrder]),
  );

  const sortOptions = [
    { key: "rating", label: "Vurdering" },
    { key: "price", label: "Pris" },
    { key: "abv", label: "ABV" },
    { key: "volume", label: "Volum" },
    { key: "vmp_name", label: "Navn" },
  ];

  $effect(() => {
    sortedProducts = orderBy(
      [...release.products],
      (product) => {
        let value = product[sortKey];
        if (value == null) return 1;
        if (typeof value === "string") {
          return value.toLowerCase();
        }
        return value;
      },
      sortOrder === "asc" ? "asc" : "desc",
    );
  });

  function getProductBadgeColor(type) {
    switch (type) {
      case "Øl":
        return "badge-primary";
      case "Mjød":
        return "badge-accent";
      case "Sider":
        return "badge-secondary";
      default:
        return "badge-neutral";
    }
  }

  function getProductTypeLabel(type) {
    switch (type) {
      case "Øl":
        return "Øl";
      case "Mjød":
        return "Mjød";
      case "Sider":
        return "Sider";
      default:
        return type;
    }
  }

  function retryFetch() {
    location.reload();
  }
</script>

<svelte:head>
  <title>{release.name} - Ølmonopolet</title>
  <meta
    name="description"
    content="Detaljer for {release.name} lansering på Ølmonopolet"
  />
</svelte:head>

<div class="flex-1 flex flex-col min-h-screen">
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
        <div class="navbar-end">
          <a href="/" class="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />
            Tilbake
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="bg-base-100 text-base-content flex-1">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Release Header -->
        <div class="card bg-base-200 mb-8" in:fly={{ y: 20, duration: 300 }}>
          <div class="card-body">
            <div
              class="flex flex-col lg:flex-row justify-between items-start gap-6"
            >
              <div class="flex-1">
                <h1 class="text-3xl font-bold flex items-center gap-3 mb-4">
                  <Beer size={32} class="text-primary" />
                  {release.name}
                </h1>

                <div class="flex items-center gap-2 mb-4">
                  <Calendar size={16} class="text-primary" />
                  <span class="text-lg">{release.formatted_date}</span>
                </div>

                <!-- Product Selections -->
                {#if release.product_selections && release.product_selections.length > 0}
                  <div class="mb-4">
                    <h3 class="font-semibold mb-2">Produktutvalg:</h3>
                    <div class="flex flex-wrap gap-2">
                      {#each release.product_selections as selection}
                        <span class="badge badge-outline">{selection}</span>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>

              <!-- Stats -->
              <div
                class="flex flex-row flex-wrap gap-4 items-end lg:items-center"
              >
                <div
                  class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]"
                >
                  <div class="text-xs font-semibold opacity-70">Totalt</div>
                  <div class="text-2xl font-bold">{release.beer_count}</div>
                </div>
                {#if release.productStats.Øl}
                  <div
                    class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]"
                  >
                    <div class="text-xs font-semibold opacity-70">Øl</div>
                    <div class="text-2xl font-bold">
                      {release.productStats.Øl}
                    </div>
                  </div>
                {/if}
                {#if release.productStats.Sider}
                  <div
                    class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]"
                  >
                    <div class="text-xs font-semibold opacity-70">Sider</div>
                    <div class="text-2xl font-bold">
                      {release.productStats.Sider}
                    </div>
                  </div>
                {/if}
                {#if release.productStats.Mjød}
                  <div
                    class="flex flex-col items-center bg-base-300 rounded-lg px-4 py-2 min-w-[80px]"
                  >
                    <div class="text-xs font-semibold opacity-70">Mjød</div>
                    <div class="text-2xl font-bold">
                      {release.productStats.Mjød}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Products Section -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-6">Produkter i lansering</h2>

          <div class="mb-4 flex flex-wrap gap-2 items-center">
            <label for="sortKey" class="font-semibold">Sorter etter:</label>
            <select
              id="sortKey"
              bind:value={sortKey}
              class="select select-sm select-bordered"
            >
              {#each sortOptions as opt}
                <option value={opt.key}>{opt.label}</option>
              {/each}
            </select>
            <button
              class="btn btn-sm btn-outline"
              onclick={() => (sortOrder = sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {#if release.products.length === 0}
            <!-- Empty State -->
            <div class="card bg-base-200 p-8 text-center">
              <div class="flex flex-col items-center gap-4">
                <Beer size={48} class="text-primary opacity-50" />
                <h3 class="font-bold text-lg">Ingen produkter funnet</h3>
                <p class="text-sm opacity-70">
                  Det er ingen produkter tilgjengelig for denne lanseringen.
                </p>
                <button
                  class="btn btn-sm btn-outline mt-2"
                  onclick={retryFetch}
                >
                  <RefreshCw size={16} />
                  Last inn på nytt
                </button>
              </div>
            </div>
          {:else}
            <!-- Products Grid -->
            <div class="grid gap-4">
              {#each sortedProducts as product, index}
                <ProductCard
                  {product}
                  {index}
                  {getProductBadgeColor}
                  {getProductTypeLabel}
                />
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <Footer />
</div>
