<script>
  import { Star, DollarSign, Droplets, Percent, MapPin } from "@lucide/svelte";
  export let product;
  export let index;
  export let getProductBadgeColor;
  export let getProductTypeLabel;
</script>

<div
  in:fly={{ y: 20, duration: 300, delay: index + 50 }}
  class="card bg-base-200 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
>
  <div class="card-body p-6">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Product Info -->
      <div class="flex-1">
        <div class="flex items-start gap-3">
          {#if product.label_sm_url}
            <img
              src={product.label_sm_url}
              alt={product.vmp_name + " etikett"}
              class="w-25 h-25 object-contain rounded shadow mr-2"
            />
          {/if}
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-1">
              {product.vmp_name}
            </h3>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="badge {getProductBadgeColor(product.main_category)}">
                {getProductTypeLabel(product.main_category)}
              </span>
              {#if product.style}
                <span class="badge badge-outline">{product.style}</span>
              {/if}
              {#if product.product_selection}
                <span class="badge badge-ghost"
                  >{product.product_selection}</span
                >
              {/if}
            </div>
            {#if product.rating}
              <div class="mb-3">
                <div class="flex items-center gap-1">
                  {#each [1, 2, 3, 4, 5] as star}
                    <Star
                      size={16}
                      class={star <= product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"}
                    />
                  {/each}
                  <span class="text-sm ml-1 opacity-80">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:min-w-[400px]">
        {#if product.price}
          <div class="flex items-center gap-2">
            <DollarSign size={16} class="text-primary" />
            <div>
              <div class="text-sm opacity-70">Pris</div>
              <div class="font-semibold">{product.price} kr</div>
            </div>
          </div>
        {/if}

        {#if product.volume}
          <div class="flex items-center gap-2">
            <Droplets size={16} class="text-primary" />
            <div>
              <div class="text-sm opacity-70">Volum</div>
              <div class="font-semibold">{product.volume} ml</div>
            </div>
          </div>
        {/if}

        {#if product.abv}
          <div class="flex items-center gap-2">
            <Percent size={16} class="text-primary" />
            <div>
              <div class="text-sm opacity-70">ABV</div>
              <div class="font-semibold">{product.abv}%</div>
            </div>
          </div>
        {/if}

        {#if product.country}
          <div class="flex items-center gap-2">
            <MapPin size={16} class="text-primary" />
            <div>
              <div class="text-sm opacity-70">Land</div>
              <div class="font-semibold">{product.country}</div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
