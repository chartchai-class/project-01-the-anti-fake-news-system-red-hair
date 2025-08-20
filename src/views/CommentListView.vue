<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Comment } from '@/types'
import Pagination from '@/components/Pagination.vue'
import CommentCard from '@/components/CommentCard.vue'
import { useNewsListStore } from '@/stores/news'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useNewsListStore()
const newsId = Number(route.params.id)

const news = computed(() => store.getById(newsId))

// pagination
const page = ref(1)
const pageSize = 3

const pagedComments = computed(() => {
  if (!news.value) return []
  const start = (page.value - 1) * pageSize
  return news.value.comments.slice(start, start + pageSize)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h2 class="text-2xl font-semibold mb-4 text-center">Comments</h2>

    <div v-if="!news?.comments?.length" class="text-gray-500 text-center py-6">
      No comments yet.
    </div>

    <div v-else>
      <CommentCard v-for="c in pagedComments" :key="c.id" :comment="c" />
      <Pagination :total="news.comments.length" v-model:page="page" :pageSize="pageSize" />
    </div>
  </div>
</template>
