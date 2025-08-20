<script setup lang="ts">
import { useNewsListStore } from '@/stores/news';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import AlterBox from '@/components/AlterBox.vue';

const newsListStore = useNewsListStore();

const title = ref('');
const category = ref('General');
const reporter = ref('Anonymous');
const description = ref('');
const content = ref('');
const image = ref('');
const router = useRouter();

const alterShow = ref(false);
const alterMessage = ref('');
const alertTitle = ref('Notification');
const alertType = ref('success');

function postNews(){
    if(alterShow.value) return;

    if( !title.value || !content.value ){
        alertTitle.value = 'Failed';
        alterMessage.value = 'Title and Content are required.';
        alterShow.value = true;
        alertType.value = 'error';
        return;
    }
    newsListStore.addNews({
        title: title.value,
        category: category.value,
        reporter: reporter.value,
        description: description.value,
        content: content.value,
        image: image.value
    })
    clearForm();

    alertTitle.value = 'Posted';
    alterMessage.value = 'News posted successfully!';
    alterShow.value = true;
    alertType.value = 'success';
}

function onModalConfirm(){
    alterShow.value = false;
    if(alertType.value === 'success') {
        router.push({ name: 'home' });
    }
}

function clearForm(){
    title.value = '';
    category.value = 'General';
    reporter.value = 'Anonymous';
    description.value = '';
    content.value = '';
    image.value = '';
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
                    <input v-model="title" type="text" placeholder="Enter title"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Category</label>
                    <select v-model="category"
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
                    <label class="block mb-2 font-semibold text-gray-700">Reporter</label>
                    <input v-model="reporter" type="text"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Description</label>
                    <textarea v-model="description" placeholder="Enter short description..." rows="2"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Content</label>
                    <textarea v-model="content" placeholder="Enter content..." rows="4"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition"></textarea>
                </div>

                <div>
                    <label class="block mb-2 font-semibold text-gray-700">Image URL</label>
                    <input v-model="image" type="text" placeholder="Enter image URL"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition" />
                    <div v-if="image" class="mt-3 flex justify-center">
                        <img :src="image" alt="Preview" class="max-h-48 rounded-lg border shadow" />
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-[#720000] transition shadow">Post</button>
                </form>
            </div>
        </div>
    </div>
</template>