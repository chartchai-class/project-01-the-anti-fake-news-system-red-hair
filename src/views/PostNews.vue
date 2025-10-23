<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import AlertBox from '@/components/AlertBox.vue';
import NewsServices from '@/services/NewsServices';
import SingleImageUpload from '@/components/SingleImageUpload.vue';

const news = ref({
    id: 0,
    title: '',
    category: '',
    reporter: {},
    newsDateTime: new Date(),
    description: '',
    content: '',
    image: '',
    fakeCount: 0,
    notFakeCount: 1,
    voteType: 'not-fake',
    comments: []
});

let user = localStorage.getItem('user')
user = JSON.parse(user ? user : '{}')
const userId = user?.id || null;
news.value.reporter = { id: userId };

const alertBox = ref({
    show: false,
    title: 'Notification',
    message: '',
    type: 'success' as 'success' | 'error'
})

function postNews(){
    if (alertBox.value.show) return;
    else if (!news.value.title || !news.value.content) {
        alertBox.value.show = true;
        alertBox.value.title = 'Failed';
        alertBox.value.message = 'Title and Content are required.';
        alertBox.value.type = 'error';
        return;
    }else{
        // can update newsDateTime here
        NewsServices.saveNews(news.value)
        .then(() => {
            console.log('News saved successfully');
            //can add more logic here
            alertBox.value.show = true;
            alertBox.value.title = 'Posted';
            alertBox.value.message = 'News posted successfully!';
            alertBox.value.type = 'success';
        })
        .catch((error) => {
            console.error('Error saving news:', error);
            alertBox.value.show = true;
            alertBox.value.title = 'Error';
            alertBox.value.message = 'There was an error posting the news. Please try again.';
            alertBox.value.type = 'error';
        })
        .finally(() => {
            clearForm();
        });
    }

}

const router = useRouter();

function onModalConfirm(){
    alertBox.value.show = false;
    if(alertBox.value.type === 'success') {
        router.push({ name: 'home' });
    }
}

function clearForm(){
    news.value.title = '';
    news.value.category = 'General';
    news.value.reporter = 'Anonymous';
    news.value.description = '';
    news.value.content = '';
    news.value.image = '';
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
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
        <RouterLink :to="{ name: 'home' }" class="self-start">
            <button class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 mt-6 mb-4 shadow">Back</button>
        </RouterLink>
        <div class="flex flex-col items-center justify-center flex-1">
            <div class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h1 class="text-3xl font-bold text-center mb-6 text-black"><span class="text-[#AB0000]">P</span>ost News</h1>
                <form @submit.prevent="postNews" class="space-y-5">

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Title</label>
                    <input v-model="news.title" type="text" placeholder="Enter title"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Category</label>
                    <select v-model="news.category"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                    <option value="General">General</option>
                    <option value="Politics">Politics</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Description</label>
                    <textarea v-model="news.description" placeholder="Enter short description..." rows="2"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Content</label>
                    <textarea v-model="news.content" placeholder="Enter content..." rows="4"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <div>
                    <!-- 
                    <input v-model="news.image" type="text" placeholder="Enter image URL"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                    <div v-if="news.image" class="mt-3 flex justify-center">
                        <img :src="news.image" alt="Preview" class="max-h-48 rounded-lg border shadow" />
                    </div> -->
                    <label class="block mb-2 font-semibold text-gray-700">Image Upload</label>
                    <SingleImageUpload type="image" v-model="news.image"/>
                </div>

                <button type="submit"
                    class="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-[#720000] transition shadow">Post</button>
                </form>
            </div>
        </div>
    </div>
</template>