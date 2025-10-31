<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import type { Comment, News } from '@/types'
import Pagination from '@/components/Pagination.vue'
import CommentCard from '@/components/CommentCard.vue'
import { useAuthStore } from '@/stores/auth'
import CommentService from '@/services/CommentService'

const props = defineProps<{
  news : News
}>()
const comments = ref<Comment[] | null>(null)
const totalComments = ref(0)
const pageSize = ref(5)
const page = ref(1)

const authStore = useAuthStore();
const newsId = (props.news as News).id
onMounted(() =>{
 watchEffect(() =>{
  loadComments()
 })
})

function loadComments(){
  if(authStore.isAdmin){
    CommentService.getCommentsByNewsIdByAdmin(newsId, page.value, pageSize.value)
      .then((response) => {
        comments.value = response.data
        totalComments.value = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : 0
      })
      .catch((error) => {
        console.error('Failed to fetch comments for admin:', error)
        return { name: 'news-detail' }
      })
  }else{
    return CommentService.getCommentsByNewsId(newsId, page.value, pageSize.value)
      .then((response) => {
        comments.value = response.data
        totalComments.value = response.headers['x-total-count'] ? parseInt(response.headers['x-total-count']) : 0
      })
      .catch((error) => {
        console.error('Failed to fetch comments:', error)
        return { name: 'news-detail' }
      })
  }
}      
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h2 class="text-2xl font-semibold mb-4 text-center">Comments</h2>

    <div v-if="!props.news?.comments?.length" class="text-gray-500 text-center py-6">
      No comments yet.
    </div>

    <div v-else>
      <CommentCard v-for="c in comments" :key="c.id" :comment="c" />
      <Pagination :total="totalComments" v-model:page="page" :pageSize="pageSize" />
    </div>
  </div>
</template>
