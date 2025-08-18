<script setup lang="ts">
import { ref } from 'vue'
import type { News } from '@/types'
defineProps<{ item: News }>()

const imgLoaded = ref(false)
const imgError  = ref(false)
</script>

<template>
  <article class="rounded-xl border bg-white overflow-hidden shadow-sm">
    <!-- img + skeleton/placeholder -->
    <div class="relative w-full h-48 bg-gray-100 overflow-hidden">
      <!-- realimg -->
      <img
        v-if="item.image && !imgError"
        :src="item.image"
        class="absolute inset-0 w-full h-full object-cover"
        alt=""
        loading="lazy"
        referrerpolicy="no-referrer"
        @load="imgLoaded = true"
        @error="imgError = true"
      />
      <!-- spookie skeleton 💀💀💀  -->
      <div
        v-if="!imgLoaded && !imgError && item.image"
        class="absolute inset-0 animate-pulse bg-gray-200"
      />
      <!-- placeholder when no pic or pic broke -->
      <img
        v-else-if="imgError || !item.image"
        src="https://placehold.co/900x480?text=No+Image"
        class="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
    </div>

    <div class="p-4">
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{{ item.category }}</span>
        <span class="text-gray-500">by {{ item.reporter }}</span>
      </div>

      <div class="flex items-center gap-2 text-xs mb-2">
        <span class="px-2 py-0.5 rounded-full"
              :class="item.voteType==='fake' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
          {{ item.voteType==='fake' ? 'Fake' : 'Not-fake' }}
        </span>
        <span class="text-gray-400">• {{ new Date(item.newsDateTime as any).toLocaleString() }}</span>
      </div>

      <h3 class="text-lg font-semibold mb-1">{{ item.title }}</h3>
      <p class="text-gray-600 line-clamp-2">{{ item.description }}</p>

      <div class="flex items-center gap-3 text-xs text-gray-600 mt-2">
        <span>Fake: {{ item.fakeCount }}</span>
        <span>Not-fake: {{ item.notFakeCount }}</span>
      </div>

      <router-link :to="`/news/${item.id}`" class="inline-block mt-3 text-blue-600 hover:underline">
        Read more »
      </router-link>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
