<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsListStore } from '@/stores/news'
import type { News, Comment, voteType } from '@/types'

const store = useNewsListStore()
const route = useRoute()
const router = useRouter()

const news = ref<News | null>(null)
const loading = ref(false)
const err = ref<string | null>(null)
const showComments = ref(false)
const newComment = ref<string>('')

// fetch news by id on mounted
async function loadNews() {
  const id = Number(route.params.id)
  if (!id) {
    err.value = 'Invalid news ID'
    return
  }

  loading.value = true
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

// add comment
function addComment() {
  if (!news.value || !newComment.value.trim()) return

  store.addComment(news.value.id, {
    author: 'Anonymous',
    content: newComment.value,
    image: '',
    voteType: 'not-fake',
  })
  newComment.value = ''
}

// go back to home
function goHome() {
  router.push({ name: 'home' })
}

onMounted(loadNews)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <button @click="goHome" class="mb-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
      ← Back to Home
    </button>

    <div v-if="err" class="text-red-600">{{ err }}</div>
    <div v-else-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="news" class="relative flex flex-col md:flex-row gap-6">
      <!-- main content -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-2">{{ news.title }}</h1>
        <div class="text-sm text-gray-500 mb-4">
          <span class="mr-2">{{ news.category }}</span>
          <span>by {{ news.reporter }}</span> •
          <span>{{ new Date(news.newsDateTime).toLocaleString() }}</span>
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

        <div class="flex items-center gap-4 text-sm text-gray-600">
          <span>Fake: {{ news.fakeCount }}</span>
          <span>Not-fake: {{ news.notFakeCount }}</span>
          <span :class="news.voteType==='fake' ? 'text-red-600' : 'text-green-600'">
            {{ news.voteType==='fake' ? 'Fake' : 'Not-fake' }}
          </span>
        </div>

        <button @click="showComments = !showComments"
                class="mt-4 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
          {{ showComments ? 'Hide' : 'Show' }} Comments ({{ news.comments.length }})
        </button>
      </div>

      <!-- comment sidebar -->
      <div v-if="showComments" class="w-full md:w-80 bg-gray-100 p-4 rounded shadow overflow-y-auto max-h-[80vh]">
        <h2 class="font-semibold mb-2">Comments</h2>

        <div v-for="c in news.comments" :key="c.id" class="mb-3 p-2 bg-white rounded shadow-sm">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{{ c.author }}</span>
            <span>{{ new Date(c.commentDateTime).toLocaleString() }}</span>
          </div>
          <p class="text-gray-700">{{ c.content }}</p>
        </div>

        <div class="mt-4">
          <textarea v-model="newComment" placeholder="Add your comment..."
                    class="w-full p-2 border rounded mb-2 resize-none"></textarea>
          <button @click="addComment"
                  class="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
