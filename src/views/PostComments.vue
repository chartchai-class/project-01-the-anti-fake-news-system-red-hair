<script setup lang="ts">
import { ref } from 'vue'
import { useNewsListStore } from '@/stores/news'
import AlterBox from '@/components/AlterBox.vue'
import { useRouter } from 'vue-router'
// Props: need the related newsId
const props = defineProps<{ newsId: number }>()
const router = useRouter()
const newsListStore = useNewsListStore()

const author = ref('Anonymous')
const content = ref('')
const image = ref('')
const voteType = ref<'fake' | 'not-fake'>('not-fake')

const alterShow = ref(false)
const alterMessage = ref('')
const alertTitle = ref('Notification')
const alertType = ref<'success' | 'error'>('success')

function postComment() {
  if (alterShow.value) return;

  if (!content.value.trim()) {
    alertTitle.value = 'Failed'
    alterMessage.value = 'Content is required.'
    alterShow.value = true
    alertType.value = 'error'
    return
  }

  newsListStore.addComment(props.newsId, {
    author: author.value,
    content: content.value,
    image: image.value,
    voteType: voteType.value,
  })
  clearForm()

  alertTitle.value = 'Posted'
  alterMessage.value = 'Comment posted successfully!'
  alterShow.value = true
  alertType.value = 'success'
}

function onModalConfirm() {
  alterShow.value = false
  if (alertType.value === 'success') {
    // go back to news detail page
    router.push({ name: 'news-detail', params: { id: props.newsId } })
  }
}

function clearForm() {
  author.value = 'Anonymous'
  content.value = ''
  image.value = ''
  voteType.value = 'not-fake'
}
</script>

<template>
  <AlterBox
    :show="alterShow"
    :title="alertTitle"
    :message="alterMessage"
    :type="alertType"
    confirmText="OK"
    @confirm="onModalConfirm"
    @close="alterShow = false"
  />

  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-neutral-300 flex flex-col">
    <RouterLink :to="{ name: 'home' }" class="self-start">
        <button class="bg-black text-white px-3 py-1 rounded hover:bg-[#720000] ml-4 mt-6 mb-4 shadow">Back</button>
    </RouterLink>
    <div class="flex flex-col items-center justify-center flex-1">
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
    <h2 class="text-2xl font-bold text-center mb-4 text-black">Post Comment</h2>
        <form @submit.prevent="postComment" class="space-y-4">
        
        <div>
            <label class="block mb-2 font-semibold text-gray-700">Author</label>
            <input v-model="author" type="text"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
        </div>

        <div>
            <label class="block mb-2 font-semibold text-gray-700">Content</label>
            <textarea v-model="content" rows="3" placeholder="Write your comment..."
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"></textarea>
        </div>

        <div>
            <label class="block mb-2 font-semibold text-gray-700">Image URL (optional)</label>
            <input v-model="image" type="text" placeholder="Enter image URL"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
        </div>

        <div>
            <label class="block mb-2 font-semibold text-gray-700">Vote Type</label>
            <select v-model="voteType"
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition">
            <option value="not-fake">Not Fake</option>
            <option value="fake">Fake</option>
            </select>
        </div>

        <button type="submit"
            class="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-[#720000] transition shadow">
            Post Comment
        </button>
        </form>
    </div>
    </div>
    
  </div>
</template>
