<script setup lang="ts">
import { type Comment } from '@/types'
defineProps<{
  comment: Comment
}>()
</script>

<template>
  <div class="form flex flex-col max-w-xl mx-auto p-4 border rounded-xl shadow bg-white my-1">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mb-2">
      <span class="font-bold text-gray-800">{{ comment.author }}</span>
      <span class="text-xs sm:text-sm mt-1 sm:mt-0 flex items-center gap-2">
        {{ new Date(comment.commentDateTime).toLocaleString() }}
        <div class="relative">
            <!-- Menu toggle button -->
            <button class="peer relative z-10 block p-1 transition-colors duration-300 transform rounded-lg focus:outline-none border-2 border-gray-500">
              <svg class="w-5 h-5 text-black-500 rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>

            <!-- Menu list -->
            <div
              class="hidden peer-focus:block absolute right-0 z-20 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800 border">
              <a href="#"
                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">Delete Comment
              </a>
              <a href="#"
                class="block px-4 py-2 text-sm text-gray-800 transition-colors duration-300 transform border-b dark:text-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">Undo Delete
              </a>
            </div>
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