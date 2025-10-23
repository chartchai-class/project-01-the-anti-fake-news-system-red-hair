<script setup lang="ts">
import { ref } from 'vue'
import AlertBox from '@/components/AlertBox.vue'
import { useRouter } from 'vue-router'
import CommentService from '@/services/CommentService';
import { useNewsListStore } from '@/stores/news'
import NewsServices from '@/services/NewsServices';
import type { News } from '@/types';
import SingleImageUpload from '@/components/SingleImageUpload.vue';
// Props: need the related newsId
const props = defineProps<{ newsId: number }>()
const router = useRouter()
const newsStore = useNewsListStore();
const comment = ref({
  id: 0,
  newsId: 0,
  author: {},
  content: '',
  image: '',
  voteType: 'not-fake' as 'fake' | 'not-fake',
  commentDateTime: new Date()
});

let user = localStorage.getItem('user')
user = JSON.parse(user ? user : '{}')
const userId = user?.id || null;
comment.value.author = { id: userId };

const alertBox = ref({
    show: false,
    title: 'Notification',
    message: '',
    type: 'success' as 'success' | 'error'
})

function postComment() {
  if (alertBox.value.show) return;

  // vote type is required
  else if (!comment.value.voteType) {
    alertBox.value.show = true;
    alertBox.value.title = 'Failed';
    alertBox.value.message = 'Please select a vote (Fake or Not-Fake).';
    alertBox.value.type = 'error';
    return;
  } else {
    CommentService.saveComment(props.newsId, userId, comment.value)
      .then(() => {
        console.log('Comment saved successfully');
        alertBox.value.show = true;
        alertBox.value.title = 'Posted';
        alertBox.value.message = 'Comment posted successfully!';
        alertBox.value.type = 'success';
      })
      .catch((error) => {
        console.error('Error saving comment:', error);
        alertBox.value.show = true;
        alertBox.value.title = 'Error';
        alertBox.value.message = 'There was an error posting the comment. Please try again.';
        alertBox.value.type = 'error';
      })
      .finally(() => {
        clearForm();
      });
  }

}
function onModalConfirm() {
  alertBox.value.show = false;
  if (alertBox.value.type === 'success') {
    // go back to news detail page
    NewsServices.getNewsById(props.newsId)
      .then((response) => {
        newsStore.setNews(response.data as News)
      })
      .catch((error) => {
        console.error('Failed to fetch news item:', error)
        return { name: 'home'}
      })
    router.push({ name: 'news-detail', params: { id: props.newsId } })
  }
}

function clearForm() {
  comment.value.author = { id: userId };
  comment.value.content = ''
  comment.value.image = ''
  comment.value.voteType = 'not-fake'
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
    <div class="container mx-auto px-4 py-6">
        <h2 class="text-2xl font-semibold mb-4 text-center">Vote & Comment</h2>
        <div class="form flex flex-col max-w-xl mx-auto p-4 border rounded-xl shadow bg-white">

            <form @submit.prevent="postComment" class="space-y-5">
                
                <!-- Vote Buttons -->
                <div class="flex justify-center gap-4">
                    <button
                        type="button"
                        @click="comment.voteType = 'fake'"
                        :class="[
                            'px-4 py-2 rounded-lg font-bold shadow transition',
                            comment.voteType === 'fake'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        ]"
                        >
                        Fake
                    </button>
                    <button
                        type="button"
                        @click="comment.voteType = 'not-fake'"
                        :class="[
                            'px-4 py-2 rounded-lg font-bold shadow transition',
                            comment.voteType === 'not-fake'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        ]"
                        >
                        Not-Fake
                    </button>
                </div>

                <!-- Author -->
                <!-- <div>
                    <label class="block mb-2 font-semibold text-gray-700">Author</label>
                    <input v-model="comment.author" type="text"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
                </div> -->

                <!-- Content -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Content</label>
                    <textarea v-model="comment.content" rows="3" placeholder="Write your comment..."
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <!-- Image URL -->
                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Image Upload</label>
                    <!-- <input v-model="comment.image" type="text" placeholder="Enter image URL"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition" />
                    <div v-if="comment.image.trim()" class="mt-3 flex justify-center">
                    <img :src="comment.image" alt="Preview" class="max-h-40 rounded-lg border shadow" />
                    </div> -->
                    <SingleImageUpload type="image" v-model="comment.image"/>
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