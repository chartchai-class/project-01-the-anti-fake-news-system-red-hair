<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useNewsListStore } from '@/stores/news'
import FilterBar from '@/components/FilterBar.vue'
import Pagination from '@/components/Pagination.vue'
import NewsCard from '@/components/NewsCard.vue'

const store = useNewsListStore()

const status = ref<'all'|'fake'|'not-fake'>('all')
const page = ref(1)
const pageSize = ref(12)
const loading = ref(false)
const err = ref<string|null>(null)


// fetch list with current query params
async function load() {
  loading.value = true
  err.value = null
  try {
    await store.fetchList({ status: status.value, page: page.value, pageSize: pageSize.value })
  } catch (e: any) {
    console.error(e); err.value = e?.message ?? 'Load failed'
  } finally {
    loading.value = false
  }
}

onMounted(load)
// when filter or pageSize changes, reset to page 1 and reload
watch([status, pageSize], () => { page.value = 1; load() })
// when page changes, reload
watch(page, load)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold mb-4">News List</h1>
      <!-- Post-News button is appearing in navbar all the time and is moved to homeView only -->
      <RouterLink
        :to="{ name: 'post-news' }"
        class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]"
      >
        <span class="text-lg leading-none">＋</span> Add News
      </RouterLink>
    </div>

    <FilterBar v-model:status="status" v-model:pageSize="pageSize" />

    <div v-if="err" class="p-4 text-red-600">Error: {{ err }}</div>
    <div v-else-if="loading" class="p-6 text-gray-500">Loading…</div>

    <div v-else class="grid md:grid-cols-3 gap-4">
      <NewsCard v-for="n in store.list" :key="n.id" :item="n" />
    </div>

    <Pagination :total="store.total" v-model:page="page" :pageSize="pageSize" />
  </div>
</template>
