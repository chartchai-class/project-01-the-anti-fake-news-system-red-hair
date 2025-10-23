<script setup lang="ts">
import { type Comment } from '@/types'
import { useAuthStore } from '@/stores/auth'
import CommentService from '@/services/CommentService';
import { useNewsListStore } from '@/stores/news'
import AlertBox from '@/components/AlertBox.vue'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const authStore = useAuthStore()
const props = defineProps<{
  comment: Comment
}>()
const newsStore = useNewsListStore();

const alertBox = ref({
  show: false,
  title: 'Notification',
  message: '',
  type: 'success' as 'success' | 'error'
})

const router = useRouter()

function onModalConfirm() {
  alertBox.value.show = false
}

function toggleDelete() {
  const currentComment = props.comment
  if (!currentComment) return // safely exit if null

  const updatedCommentStatus = !currentComment.isDeleted
  tempUpdateStatusInNewsStore(currentComment.voteType, updatedCommentStatus)

  CommentService.toggleDeleteComment(currentComment.id, updatedCommentStatus)
    .then(() => {
      currentComment.isDeleted = updatedCommentStatus

      alertBox.value.show = true
      alertBox.value.title = 'Success'
      alertBox.value.type = 'success'
      alertBox.value.message = updatedCommentStatus
        ? 'Comment deleted successfully.'
        : 'Comment restored successfully.'
    })
    .catch((error) => {
      console.error('Failed to toggle delete:', error)
      alertBox.value.show = true
      alertBox.value.title = 'Error'
      alertBox.value.message = 'Failed to update comment status.'
      alertBox.value.type = 'error'
      return { name: 'news-detail' }
  })
}

function tempUpdateStatusInNewsStore(commentStatus: string, updatedDeleted: boolean){
  if(newsStore.news){
    if(commentStatus == 'fake' && !updatedDeleted){
      newsStore.news.fakeCount += 1
    }else if(commentStatus == 'fake' && updatedDeleted){
      newsStore.news.fakeCount -= 1
    }else if(commentStatus == 'not-fake' && !updatedDeleted){
      newsStore.news.notFakeCount += 1
    }else if(commentStatus == 'not-fake' && updatedDeleted){
      newsStore.news.notFakeCount -= 1
    }

    newsStore.news.voteType= newsStore.news?.fakeCount>newsStore.news?.notFakeCount ? 'fake' : 'not-fake'
  }

  
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
  <div class="form flex flex-col max-w-xl mx-auto p-4 border rounded-xl shadow bg-white my-1">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mb-2">
      <span class="font-bold text-gray-800">{{ comment.author }}</span>
      <span class="text-xs sm:text-sm mt-1 sm:mt-0 flex items-center gap-2">
        {{ new Date(comment.commentDateTime).toLocaleString() }}
        <div v-if="!comment.isDeleted && authStore.isAdmin" class="inline-flex items-center rounded-md shadow-sm">
            <button @click="toggleDelete"
              class="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg rounded-l-lg font-medium px-1 py-1 inline-flex space-x-1 items-center">
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
              </span>
              <span class="hidden md:inline-block text-red-600">Delete</span>
            </button>
          </div>

          <div v-if="comment.isDeleted && authStore.isAdmin" class="inline-flex items-center rounded-md shadow-sm">
            <button @click="toggleDelete"
              class="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-r-lg rounded-l-lg font-medium px-1 py-1 inline-flex space-x-1 items-center">
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
              </span>
              <span class="hidden md:inline-block text-red-600">Undo Delete</span>
            </button>
          </div>
      </span>
    </div>
    <div class="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
      <p class="text-gray-700 mb-2">{{ comment.content }}</p>
      <span class="inline-block text-xs px-2 py-0.5 rounded-full font-semibold"
            :class="comment.voteType === 'fake' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
        {{ comment.voteType === 'fake' ? 'Fake' : 'Not-fake' }}
      </span>
    </div>
    <img v-if="comment.image" :src="comment.image" alt="Vote image"
      class="mt-2 rounded-lg object-cover w-full h-auto max-h-60"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="($event.target as HTMLImageElement).style.display='none'" />
  </div>
</template>