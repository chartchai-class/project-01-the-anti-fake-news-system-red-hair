<script setup lang="ts">
import { ref, computed } from 'vue'
import type { News } from '@/types'
import Pagination from '@/components/Pagination.vue'
import CommentCard from '@/components/CommentCard.vue'

const props = defineProps<{
  news : News
}>()

const page = ref(1)
const pageSize = 3

// NEED to check loading image and put skeleton if loading too long

const pagedComments = computed(() => {
  if (!props.news) return []
  const start = (page.value - 1) * pageSize
  return props.news.comments.slice(start, start + pageSize)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h2 class="text-2xl font-semibold mb-4 text-center">Comments</h2>

    <div v-if="!props.news?.comments?.length" class="text-gray-500 text-center py-6">
      No comments yet.
    </div>

    <div v-else>
      <CommentCard v-for="c in pagedComments" :key="c.id" :comment="c" />
      <Pagination :total="props.news.comments.length" v-model:page="page" :pageSize="pageSize" />
    </div>
  </div>
</template>
