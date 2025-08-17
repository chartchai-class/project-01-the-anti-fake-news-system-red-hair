<script setup lang="ts">
import { useTempNewsStore } from '@/stores/tempNews';
import { ref } from 'vue';

const tempNewsStore = useTempNewsStore();

const title = ref('');
const category = ref('General');
const reporter = ref('Anonymous');
const description = ref('');
const content = ref('');
const image = ref('');

function postNews(){
    if( !title.value || !content.value ){
        return alert('Title and Content are required.');
    }
    tempNewsStore.addNews({
        title: title.value,
        category: category.value,
        reporter: reporter.value,
        description: description.value,
        content: content.value,
        image: image.value
    })
    clearForm();
    alert('News posted successfully!');
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
    <div class="">
        <RouterLink :to="{ name: 'home' }">
            <button class="bg-black text-white px-3 py-1 rounded hover:bg-[#720000] ml-4 mt-2">Back</button>
        </RouterLink>
        <h1 class="text-2xl text-center font-bold mb-4 py-4">Post News</h1>

        <div class="form flex flex-col max-w-md mx-auto p-4 border border-gray-300 rounded shadow">
            <div class="mb-4">
                <label class="block mb-2">Title</label>
                <input v-model="title" type="text" placeholder="Enter title" class="w-full p-2 border rounded" />
            </div>

            <div class="mb-4">
                <label class="block mb-2">Category</label>
                <select v-model="category" class="w-full p-2 border rounded">
                    <option value="General">General</option>
                    <option value="Politics">Politics</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block mb-2">Reporter</label>
                <input v-model="reporter" type="text" class="w-full p-2 border rounded" />
            </div>

            <div class="mb-4">
                <label class="block mb-2">Description</label>
                <textarea v-model="description" placeholder="Enter short description..." rows="2" class="w-full p-2 border rounded"></textarea>
            </div>

            <div class="mb-4">
                <label class="block mb-2">Content</label>
                <textarea v-model="content" placeholder="Enter content..." rows="5" class="w-full p-2 border rounded"></textarea>
            </div>
            <div class="mb-4">
                <label class="block mb-2">Image URL</label>
                <input v-model="image" type="text" placeholder="Enter image URL" class="w-full p-2 border rounded" />
            </div>
            <button @click="postNews" class="bg-black text-white px-4 py-2 rounded hover:bg-[#720000]">Post</button>
        </div>
    </div>

</template>