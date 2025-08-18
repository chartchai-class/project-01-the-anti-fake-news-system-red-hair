<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Comment } from '@/types'
import Pagination from '@/components/Pagination.vue'
import CommentCard from '@/components/CommentCard.vue'

const props = defineProps<{
  comments: Comment[]
  show: boolean
}>()

// pagination
const page = ref(1)
const pageSize = 3

// reset page when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    page.value = 1
  }
})

const pagedComments = computed(() => {
  const start = (page.value - 1) * pageSize
  return props.comments.slice(start, start + pageSize)
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
      <button @click="$emit('close')"
              class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold">
        ✕
      </button>

      <h2 class="text-2xl font-semibold mb-4 text-center">Comments</h2>

      <!-- If no comments -->
      <div v-if="comments.length === 0" class="text-gray-500 text-center py-6">
        No comments yet.
      </div>

      <!-- If there are comments -->
      <div v-else>
        <CommentCard v-for="c in pagedComments" :key="c.id" :comment="c" />
        <Pagination :total="comments.length" v-model:page="page" :pageSize="pageSize" />
      </div>
    </div>
  </div>
</template>
