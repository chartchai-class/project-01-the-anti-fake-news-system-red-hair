<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNewsListStore } from '@/stores/news'
import FilterBar from '@/components/FilterBar.vue'
import Pagination from '@/components/Pagination.vue'
import NewsCard from '@/components/NewsCard.vue'

const store = useNewsListStore()
store.initIfNeeded()

// UI state
const status = ref<'all' | 'fake' | 'not-fake'>('all')
const page = ref(1)
const pageSize = ref(12)
const loading = ref(false)

// Pure filter (no side effects here)
const filtered = computed(() => {
  return status.value === 'all'
    ? store.list
    : store.list.filter(n => n.voteType === status.value)
})

// Total items after filter
const total = computed(() => filtered.value.length)

// Current page slice
const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

// Reset page to 1 when filter/pageSize changes
watch([status, pageSize], () => { page.value = 1 })

// Lightweight loading UX when filter/pageSize changes (150ms)
let t: number | undefined
watch([status, pageSize], () => {
  loading.value = true
  if (t) clearTimeout(t)
  t = window.setTimeout(() => { loading.value = false }, 150)
}, { immediate: true })
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">newlist</h1>

    <!-- Filter + page size controls -->
    <FilterBar v-model:status="status" v-model:pageSize="pageSize" />

    <!-- Loading hint -->
    <div v-if="loading" class="p-6 text-gray-500">Loading…</div>

    <!-- Cards grid -->
    <div v-else class="grid md:grid-cols-3 gap-4">
      <NewsCard v-for="n in pageItems" :key="n.id" :item="n" />
    </div>

    <!-- Pagination -->
    <Pagination :total="total" v-model:page="page" :pageSize="pageSize" />
  </div>
</template>
