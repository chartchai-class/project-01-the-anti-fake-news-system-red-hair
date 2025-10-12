<script setup lang="ts">
import { ref, watch, onMounted, watchEffect, onUnmounted } from 'vue'
import FilterBar from '@/components/FilterBar.vue'
import Pagination from '@/components/Pagination.vue'
import NewsCard from '@/components/NewsCard.vue'
import LoadingCircle from '@/components/LoadingCircle.vue'
import NewsServices from '@/services/NewsServices'
import type { News, filterType } from '@/types'

const news = ref<News[] | null>(null)
const totalNews = ref(0)
const status = ref<filterType>('all') // filter type: 'all' | 'fake' | 'not-fake'
const page = ref(1)
const pageSize = ref(12)
const loading = ref(false)
const err = ref<string|null>(null)

// scroll top functions
const showScrollTop = ref(false)
function handleScroll(){
  showScrollTop.value = window.scrollY > 300
}
function scrollToTop(){
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  watchEffect(() =>{
    loading.value = true
    err.value = null
    NewsServices.getNewsByPage(page.value, pageSize.value, status.value)
      .then((response) => {
        news.value = response.data
        totalNews.value = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : 0
      })
      .catch((error) => {
        console.error(error)
        err.value = error?.message ?? 'Load failed'
      })
      .finally(() => {
        loading.value = false
      })
  })
})

// reset page to 1 when filter or pageSize changes
watch([status, pageSize], () => { page.value = 1 })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })

</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold mb-4"><span class="text-[#AB0000]">N</span>EWS LIST</h1>
      <RouterLink
        :to="{ name: 'post-news' }"
        class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]"
      >
        <span class="text-lg leading-none">＋</span> Add News
      </RouterLink>
    </div>

    <FilterBar v-model:status="status" v-model:pageSize="pageSize" />

    <div v-if="err" class="p-4 text-red-600">Error: {{ err }}</div>
    <div v-else-if="loading" class="p-6 text-gray-500 m-10 flex justify-center items-center">
      <LoadingCircle />
    </div>

    <div v-else class="grid md:grid-cols-3 gap-4">
      <NewsCard v-for="n in news" :key="n.id" :item="n" />
    </div>

    <Pagination :total="totalNews" v-model:page="page" :pageSize="pageSize" class="my-5"/>
  </div>

  <button
    v-if="showScrollTop"
    @click="scrollToTop"
    class="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-black text-white shadow-lg hover:bg-[#720000] transition-opacity duration-200"
    aria-label="Scroll to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </button>
</template>
