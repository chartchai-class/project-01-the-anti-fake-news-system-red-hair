<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'nprogress/nprogress.css'
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-200">
    <header class="sticky top-0 z-50 bg-black/95 border-b">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <img @click="goHome" alt="Vue logo"
          class="hidden sm:block w-7 h-7 lg:w-9 lg:h-9 sm:w-8 sm:h-8 rounded object-cover cursor-pointer"
          src="@/assets/793535a9837c8f0e53e51ba7a0a88ade.jpg" />
        <h1 @click="goHome"
          class="text-2xl lg:text-4xl sm:text-3xl font-bold mx-auto text-center text-white cursor-pointer">
          <span class="text-[#AB0000]">R</span>ED HAIR: ANTI FAKE NEWS SYSTEM
        </h1>
      </div>
    </header>

    <RouterView />
  </div>

</template>
