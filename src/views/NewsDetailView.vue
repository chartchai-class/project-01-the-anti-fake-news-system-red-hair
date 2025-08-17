<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsListStore } from '@/stores/news'
import type { News } from '@/types'
import Pagination from '@/components/Pagination.vue'

const store = useNewsListStore()
const route = useRoute()
const router = useRouter()

const news = ref<News | null>(null)
const loading = ref(false)
const err = ref<string | null>(null)
const showComments = ref(false)

// pagination states
const page = ref(1)
const pageSize = 5
const pagedComments = computed(() => {
  if (!news.value) return []
  const start = (page.value - 1) * pageSize
  return news.value.comments.slice(start, start + pageSize)
})

// fetch news by id
async function loadNews() {
  const id = Number(route.params.id)
  if (!id) {
    err.value = 'Invalid news ID'
    return
  } loading.value = true
  err.value = null
  try {
    news.value = await store.fetchOne(id)
  } catch (e: any) {
    console.error(e)
    err.value = e?.message ?? 'Failed to load news'
  } finally {
    loading.value = false
  }
}



// go back to home
function goHome() {
  router.push({ name: 'home' })
}

// navigation for vote & comment pages

function goVoteAndCommentPage() {
  router.push({ name: 'vote-and-comment', params: { id: news.value?.id } });
}

onMounted(loadNews)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <button @click="goHome" class="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 ml-4 mt-2">
      Back
    </button>

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

        <img v-if="news.image"
             :src="news.image"
             alt=""
             class="w-full max-h-96 object-cover rounded mb-4"
             loading="lazy"
             referrerpolicy="no-referrer"
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

        <div class="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
            <div class="flex flex-col gap-2">
            <button @click="showComments = true"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Show Comments ({{ news.comments.length }})
            </button>
            </div>
            <div class="flex flex-col gap-2">
                <button @click="goVoteAndCommentPage"
                    class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Vote & Comment
                </button>
            </div>
        </div>
      </div>
    </div>

    <div v-if="showComments" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button @click="showComments = false"
                class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold">
          ✕
        </button>

        <h2 class="text-2xl font-semibold mb-4 text-center">Comments</h2>

        <div v-for="c in pagedComments" :key="c.id" class="form flex flex-col max-w-md mx-auto p-4 border rounded shadow">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mb-2">
            <span class="font-bold text-gray-800">{{ c.author }}</span>
            <span class="text-xs sm:text-sm mt-1 sm:mt-0">{{ new Date(c.commentDateTime).toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
            <p class="text-gray-700 mb-2">{{ c.content }}</p>
            <span class="inline-block text-xs px-2 py-0.5 rounded-full font-semibold"
                  :class="c.voteType === 'fake' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                {{ c.voteType === 'fake' ? 'Fake' : 'Not-fake' }}
            </span>
          </div>
          <img v-if="c.image" :src="c.image" alt="Vote image"
            class="mt-2 rounded-lg object-cover w-full h-auto max-h-48"
            loading="lazy"
            referrerpolicy="no-referrer"
            @error="($event.target as HTMLImageElement).style.display='none'" />
        </div>
        
        
        
        <Pagination :total="news.comments.length"
                    :page="page"
                    :page-size="pageSize"
                    @update:page="page = $event" />
      </div>
    </div>
  </div>
</template>

