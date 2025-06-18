<script>
  import { Beer, Calendar } from "@lucide/svelte";
  export let release;
</script>

<div class="card bg-base-200 mb-8" in:fly={{ y: 20, duration: 300 }}>
  <div class="card-body">
    <div class="flex flex-col lg:flex-row justify-between items-start gap-6">
      <div class="flex-1">
        <h1 class="text-3xl font-bold flex items-center gap-3 mb-4">
          <Calendar size={32} class="text-primary" />
          {release.formatted_date}
        </h1>
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
      <div class="flex flex-row flex-wrap gap-2 items-end lg:items-center">
        <div
          class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm sm:px-4 sm:py-2 sm:min-w-[80px] sm:text-base"
        >
          <div class="font-semibold opacity-70">Totalt</div>
          <div class="font-bold text-base sm:text-2xl">
            {release.product_stats.product_count}
          </div>
        </div>
        {#if release.product_stats.beer_count}
          <div
            class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm sm:px-4 sm:py-2 sm:min-w-[80px] sm:text-base"
          >
            <div class="font-semibold opacity-70">Øl</div>
            <div class="font-bold text-base sm:text-2xl">
              {release.product_stats.beer_count}
            </div>
          </div>
        {/if}
        {#if release.product_stats.cider_count}
          <div
            class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[65px] text-sm sm:px-4 sm:py-2 sm:min-w-[80px] sm:text-base"
          >
            <div class="font-semibold opacity-70">Sider</div>
            <div class="font-bold text-base sm:text-2xl">
              {release.product_stats.cider_count}
            </div>
          </div>
        {/if}
        {#if release.product_stats.mead_count}
          <div
            class="flex flex-col items-center bg-base-300 rounded-lg px-2 py-1 min-w-[60px] text-sm sm:px-4 sm:py-2 sm:min-w-[80px] sm:text-base"
          >
            <div class="font-semibold opacity-70">Mjød</div>
            <div class="font-bold text-base sm:text-2xl">
              {release.product_stats.mead_count}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
