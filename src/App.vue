<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<!-- //top bar -->
  <header class="sticky top-0 z-50 bg-white/90 border-b">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <!-- // logo and name -->
      <div class="flex items-center gap-3">
        <img
          alt="Vue logo"
          class="w-12 h-12 rounded object-cover"
          src="@/assets/793535a9837c8f0e53e51ba7a0a88ade.jpg"
        />
        <HelloWorld msg="The Anti Fake News System Red Hair!" />
      </div>

     <!-- // add new butt -->
      <RouterLink
        :to="{ name: 'post-news' }"
        class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700"
      >
        <span class="text-lg leading-none">＋</span> Add News
      </RouterLink>
    </div>
  </header>

  <RouterView />
</template>
