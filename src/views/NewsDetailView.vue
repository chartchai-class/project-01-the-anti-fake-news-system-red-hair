<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsListStore } from '@/stores/news'
import { storeToRefs } from 'pinia'
import AlertBox from '@/components/AlertBox.vue'

const route = useRoute()
const router = useRouter()
const childSection = ref<HTMLElement | null>(null)
const loading = ref(false)
const err = ref<string | null>(null)
const showComments = ref(false)
const newsStore = useNewsListStore()
const { news } = storeToRefs(newsStore)
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import NewsServices from '@/services/NewsServices'

//I just put it to remove parent-child props warning in console.
defineProps<{ id: number }>() 

function goHome() {
  router.push({ name: 'home' })
}

function toggleDelete() {
  const currentNews = news.value
  if (!currentNews) return // safely exit if null

  const newStatus = !currentNews.isDeleted

  NewsServices.toggleSoftDeleteNews(currentNews.id, newStatus)
    .then(() => {
      currentNews.isDeleted = newStatus
      alertBox.value.show = true
      alertBox.value.title = 'Success'
      alertBox.value.type = 'success'
      alertBox.value.message = newStatus
        ? 'News deleted successfully.'
        : 'News restored successfully.'
    })
    .catch((error) => {
      console.error('Failed to toggle delete:', error)
      alertBox.value.show = true
      alertBox.value.title = 'Error'
      alertBox.value.message = 'Failed to update delete status.'
      alertBox.value.type = 'error'
    })
}

// 🔹 Toggle navigation helper functions
function toggleComments() {
  if (route.name === 'view-comments') {
    // if already open, go back to parent news view
    router.push({ name: 'news-detail', params: { id: news.value?.id } })
  } else {
    router.push({ name: 'view-comments', params: { id: news.value?.id } })
  }
}

function toggleVoteComment() {
  if (route.name === 'post-comment') {
    router.push({ name: 'news-detail', params: { id: news.value?.id } })
  } else {
    router.push({ name: 'post-comment', params: { id: news.value?.id } })
  }
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

const alertBox = ref({
  show: false,
  title: 'Notification',
  message: '',
  type: 'success' as 'success' | 'error'
})

function onModalConfirm() {
  alertBox.value.show = false
}
</script>

<template>
  <AlertBox
  :show="alertBox.show"
  :title="alertBox.title"
  :message="alertBox.message"
  :type="alertBox.type"
  confirmText="OK"
  @confirm="onModalConfirm"
  @close="alertBox.show = false"
  />
  <button @click="goHome" class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 mt-6 mb-4 shadow">Back</button>
  <div class="container mx-auto px-4 py-6">
    <div v-if="err" class="text-red-600">{{ err }}</div>
    <div v-else-if="loading" class="text-gray-500">Loading…</div>
    <div v-else-if="news" class="form flex flex-col max-w-3xl mx-auto p-4 border rounded-xl shadow bg-white">
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2 flex justify-between items-center">
          <div>
            {{ news.title }}
          </div>
          <div v-if="!news.isDeleted && authStore.isAdmin" class="inline-flex items-center rounded-md shadow-sm">
            <button @click="toggleDelete"
              class="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-gray-200 rounded-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
              </span>
              <span class="hidden md:inline-block text-red-600">Delete</span>
            </button>
          </div>

          <div v-if="news.isDeleted && authStore.isAdmin" class="inline-flex items-center rounded-md shadow-sm">
            <button @click="toggleDelete"
              class="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
              </span>
              <span class="hidden md:inline-block text-red-600">Undo Delete</span>
            </button>
          </div>
        </h1>
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
          <button
            @click="toggleComments"
            class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]"
          >
            <span v-if="authStore.isAdmin">Show Comments ({{ news.comments.length }})</span>
            <span v-else>Show Comments ({{ news.comments.filter(c => !c.isDeleted).length }})</span>
          </button>

          <button
            @click="toggleVoteComment"
            class="inline-flex items-center gap-2 rounded-lg bg-black text-white px-3 py-1.5 hover:bg-[#720000]"
          >
            Vote & Comment
          </button>
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

