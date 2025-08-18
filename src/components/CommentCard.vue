<script setup lang="ts">
import { type Comment } from '@/types'
defineProps<{
  comment: Comment
}>()
</script>

<template>
    <div class="form flex flex-col max-w-md mx-auto p-4 border rounded shadow">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mb-2">
      <span class="font-bold text-gray-800">{{ comment.author }}</span>
      <span class="text-xs sm:text-sm mt-1 sm:mt-0">
        {{ new Date(comment.commentDateTime).toLocaleString() }}
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
      class="mt-2 rounded-lg object-cover w-full h-auto max-h-48"
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="($event.target as HTMLImageElement).style.display='none'" />
  </div>
</template>