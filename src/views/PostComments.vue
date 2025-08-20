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

  if (!author.value.trim()) {
    alertTitle.value = 'Failed'
    alterMessage.value = 'Author is required.'
    alterShow.value = true
    alertType.value = 'error'
    return
  }

  // Vote required
  if (!voteType.value) {
    alertTitle.value = 'Failed'
    alterMessage.value = 'Please select a vote (Fake or Not-Fake).'
    alterShow.value = true
    alertType.value = 'error'
    return
  }

  // Check if there is content or an image to post a full comment
  const hasCommentContent = content.value.trim() !== '' || image.value.trim() !== '';

  if (hasCommentContent){
    //If there is content or an image
    newsListStore.addComment(props.newsId, {
    author: author.value,
    content: content.value || '',
    image: image.value || '',
    voteType: voteType.value,
    })
    alertTitle.value = 'Posted'
    alterMessage.value = 'Comment posted successfully!'
    alertType.value = 'success'
  } else {
    // If there is no content or image, only update the vote count
    if (voteType.value === 'fake') {
      newsListStore.voteFake(props.newsId);
    } else {
      newsListStore.voteNotFake(props.newsId);
    }
    alertTitle.value = 'Voted'
    alterMessage.value = 'Vote recorded successfully!'
    alertType.value = 'success'
  }
  clearForm()
  alterShow.value = true
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
    <div class="container mx-auto px-4 py-6">
        <h2 class="text-2xl font-semibold mb-4 text-center">Vote & Comment</h2>
        <div class="form flex flex-col max-w-xl mx-auto p-4 border rounded-xl shadow bg-white">

            <form @submit.prevent="postComment" class="space-y-5">
                
                <!-- Vote Buttons -->
                <div class="flex justify-center gap-4">
                    <button
                        type="button"
                        @click="voteType = 'fake'"
                        :class="[
                            'px-4 py-2 rounded-lg font-bold shadow transition',
                            voteType === 'fake'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        ]"
                        >
                        Fake
                    </button>
                    <button
                        type="button"
                        @click="voteType = 'not-fake'"
                        :class="[
                            'px-4 py-2 rounded-lg font-bold shadow transition',
                            voteType === 'not-fake'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        ]"
                        >
                        Not-Fake
                    </button>
                </div>

                <!-- Author -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Author</label>
                    <input v-model="author" type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
                </div>

                <!-- Content -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Content</label>
                    <textarea v-model="content" rows="3" placeholder="Write your comment..."
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <!-- Image URL -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Image URL (optional)</label>
                    <input v-model="image" type="text" placeholder="Enter image URL"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
                    <div v-if="image.trim()" class="mt-3 flex justify-center">
                    <img :src="image" alt="Preview" class="max-h-40 rounded-lg border shadow" />
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit"
                    class="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-[#720000] transition shadow">
                    Post Comment
                </button>
            </form>
        </div>
    </div>
</template>