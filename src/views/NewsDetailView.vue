<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { News } from '@/types'
import NewsServices from '@/services/NewsServices'
import CommentListView from '@/views/CommentListView.vue'
import { useNewsListStore } from '@/stores/news'
const route = useRoute()
const router = useRouter()
const childSection = ref<HTMLElement | null>(null)
const newsStore = useNewsListStore()
const news = ref<News | null>(null)
const loading = ref(false)
const err = ref<string | null>(null)
const showComments = ref(false)

async function loadNews() {
  const id = Number(route.params.id)
  if (!id) {
    err.value = 'Invalid news ID'
    loading.value = false
    return
  }
  
  try {
    // First check if this item exists in the store (both temp and server items)
    const storeItem = newsStore.getById(id)
    if (storeItem) {
      news.value = storeItem
      loading.value = false
      return
    }
    
    // If not in store and it's a temp item, it doesn't exist
    if (id < 0) {
      throw new Error('Temporary news item not found')
    }
    
    // For regular items not in store, fetch from server
    const res = await NewsServices.getNewsById(id)
    news.value = res.data
  } catch (e: unknown) {
    err.value = e instanceof Error ? e.message : 'Failed to load news'
  } finally {
    loading.value = false
  }
}

// go back to home
function goHome() {
  router.push({ name: 'home' })
}

// whenever route changes to a child, scroll into view
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes('/comments') || newPath.includes('/comment')) {
      // wait a tick to let content render
      requestAnimationFrame(() => {
        childSection.value?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }
)

onMounted(loadNews)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <button @click="goHome" class="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 ml-4 mt-2">Back</button>
    <div v-if="err" class="text-red-600">{{ err }}</div>
    <div v-else-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="news" class="form flex flex-col max-w-md mx-auto p-4 border rounded shadow">
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2">{{ news.title }}</h1>
        <div class="text-sm text-gray-500 mb-4">
          <span>by {{ news.reporter }}  
          </span> •
          <span>{{ new Date(news.newsDateTime).toLocaleString() }}</span>
        </div>
        <div class="text-sm text-gray-500 mb-4">
          <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{{ news.category }}</span>
        </div>

        <img v-if="news.image" :src="news.image" alt="" class="w-full max-h-96 object-cover rounded mb-4" loading="lazy" referrerpolicy="no-referrer"
            @error="($event.target as HTMLImageElement).style.display='none'" />

        <p class="text-gray-700 mb-4">{{ news.description }}</p>
        <div class="prose mb-4" v-html="news.content"></div>

        <div class="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-4">
            <span>Fake: {{ news.fakeCount }}</span>
            <span>Not-fake: {{ news.notFakeCount }}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full items-end" :class="news.voteType==='fake' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
            {{ news.voteType==='fake' ? 'Fake' : 'Not-fake' }}
          </span>
        </div>

        <!-- Show Comments and Vote & Comment Buttons -->
        <div class="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
          <RouterLink :to="{ name: 'news-comments', params: { id: news.id } }">
            <button @click="showComments = true" 
            class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]">
                  Show Comments ({{ news.comments.length }})
            </button>
          </RouterLink>
          <div class="flex flex-col gap-2">
            <RouterLink :to="{ name: 'post-comment', params: { id: news.id } }">
              <button class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]">
                Vote & Comment
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- comment modal -->
    <!-- <CommentListView v-if="news" :comments="news.comments" :show="showComments" @close="showComments = false"/> -->
    <div ref="childSection">
      <router-view />
    </div>
  </div>
</template>

