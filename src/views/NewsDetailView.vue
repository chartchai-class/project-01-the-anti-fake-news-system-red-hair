<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsListStore } from '@/stores/news'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const childSection = ref<HTMLElement | null>(null)
const loading = ref(false)
const err = ref<string | null>(null)
const showComments = ref(false)
const newsStore = useNewsListStore()
const { news } = storeToRefs(newsStore)

//I just put it to remove parent-child props warning in console.
defineProps<{ id: number }>() 

function goHome() {
  router.push({ name: 'home' })
}

// whenever route changes to a child, scroll into view
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath.includes('/view-comments') || newPath.includes('/post-comment')) {
      // wait a tick to let content render
      requestAnimationFrame(() => {
        childSection.value?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }
)
</script>

<template>
  <button @click="goHome" class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 mt-6 mb-4 shadow">Back</button>
  <div class="container mx-auto px-4 py-6">
    <div v-if="err" class="text-red-600">{{ err }}</div>
    <div v-else-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="news" class="form flex flex-col max-w-3xl mx-auto p-4 border rounded-xl shadow bg-white">
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
          <RouterLink :to="{ name: 'view-comments'}">
            <button @click="showComments = true" 
            class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]">
                  Show Comments ({{ news.comments.length }})
            </button>
          </RouterLink>
          <div class="flex flex-col gap-2">
            <RouterLink :to="{ name: 'post-comment' }">
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
      <router-view :news="news" />
    </div>
  </div>
</template>

