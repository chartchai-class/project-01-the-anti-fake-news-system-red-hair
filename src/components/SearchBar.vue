<script setup lang="ts">
import type { News, searchType } from '@/types';
import BaseInput from './BaseInput.vue';
import { computed, ref } from 'vue';
import NewsServices from '@/services/NewsServices';
import { useRoute, useRouter } from 'vue-router';

defineProps<{
    status: searchType
    pageSize: number
}>()
const emit = defineEmits<{
  (e:'update:status', v:searchType):void
  (e:'update:pageSize', v:number):void
}>()

const route = useRoute()
const router = useRouter()
const page = computed(() => Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 2) // default to 2
const news = ref<News[] | null>(null)
const totalNews = ref(0)
const keyword = ref('')

function updateKeyword(value: string) {
  let queryFunction;
  if (keyword.value === '') {
    queryFunction = NewsServices.getNewsByPage(limit.value, page.value)
  } else {
    queryFunction = NewsServices.getNewsByKeyword(keyword.value, limit.value, page.value)
  }
  queryFunction.then((response) => {
    news.value = response.data
    console.log('events', news.value)
    totalNews.value = response.headers['x-total-count']
    console.log('totalEvent', totalNews.value)
  }).catch(() => {
    router.push({name: 'network-error-view'})
  })
}

</script>

<template>
    <div>
        <div class="w-64">
            <BaseInput
                v-model = "keyword"
                type="text"
                label = "Search News"
                @input="updateKeyword"
                />
        </div>
    
        <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="text-sm">Search By:</label>
            <select class="border rounded px-2 py-1"
                    :value="status"
                    @change="emit('update:status', ($event.target as HTMLSelectElement).value as any)">
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="reporter">Reporter</option>
            </select>
        </div>
    </div>
</template>