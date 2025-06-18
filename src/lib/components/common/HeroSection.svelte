<script>
  import { Play, Apple, Chrome } from "@lucide/svelte";
  import hero from "$lib/assets/hero.svg";
</script>

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
        Ølmonopolet er en tjeneste for å finne det beste av øl, sider og mjød på
        Vinmonopolet.
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
