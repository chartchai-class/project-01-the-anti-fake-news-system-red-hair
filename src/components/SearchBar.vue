<script setup lang="ts">
import type { searchType } from '@/types';
import BaseInput from './BaseInput.vue';
import { ref } from 'vue';


const props = defineProps<{
    searchBy: searchType
    keyword: string
}>()
const emit = defineEmits<{
  (e:'update:searchBy', v:searchType):void
  (e:'update:keyword', v:string):void
}>()

const keywordField = ref(props.keyword)

</script>

<template>
    <div class="flex flex-wrap items-center gap-3 mb-4">
        <div class="w-64">
            <BaseInput
                v-model = "keywordField"
                type="text"
                label = "Search News"
                @change="emit('update:keyword', ($event.target as HTMLSelectElement).value as any)"
                />
        </div>
    
        <div class="flex flex-wrap items-center gap-3 mb-4">
            <label class="text-sm">Search By:</label>
            <select class="border rounded px-2 py-1"
                    :value="searchBy"
                    @change="emit('update:searchBy', ($event.target as HTMLSelectElement).value as any)">
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="reporter">Reporter</option>
            </select>
        </div>
    </div>
</template>