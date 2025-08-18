<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
<!-- //top bar -->
  <header class="sticky top-0 z-50 bg-black/95 border-b">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <img
          alt="Vue logo"
          class="w-9 h-9 rounded object-cover"
          src="@/assets/793535a9837c8f0e53e51ba7a0a88ade.jpg"
        />
        <h1 class="text-2xl font-bold mx-auto text-white"><span class="text-[#AB0000]">R</span>ED HAIR: ANTI FAKE NEWS SYSTEM</h1>
    </div>
  </header>

  <RouterView />
</template>
