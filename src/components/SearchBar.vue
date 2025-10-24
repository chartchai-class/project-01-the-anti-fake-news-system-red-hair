<script setup lang="ts">
import type { searchType } from '@/types';
import BaseInput from './BaseInput.vue';
import { ref, watch } from 'vue';

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
  <div class="py-4 w-80 sm:w-96 w-fill text-gray-600 outline-none focus:outline-none">
    <div class="relative flex items-center">
      <!-- Filter Select -->
      <select class="appearance-none leading-none align-middle bg-white-800 h-8 sm:h-10 px-5 w-28 sm:w-48 rounded-l-full text-[11px] sm:text-sm focus:outline-none focus:ring-0 focus:shadow-none border-2 border-gray-500 border-r-0 cursor-pointer"
        :value="searchBy"
        @change="emit('update:searchBy', ($event.target as HTMLSelectElement).value as searchType)"
      >
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="reporter">Reporter</option>
      </select>

      <!-- Search Input -->
      <BaseInput
        v-model="keywordField"
        type="text"
        placeholder="Search"
        @change="emit('update:keyword', ($event.target as HTMLSelectElement).value as any)"
        class="leading-none align-middle bg-white-800 h-8 sm:h-10 flex px-5 w-32 sm:w-full rounded-r-full text-[11px] sm:text-sm focus:outline-none focus:ring-0 focus:shadow-none border-2 border-l-0 border-gray-500"
      />

      <!-- Search Button -->
      <button
        type="button"
        class="absolute inset-y-0 right-20 sm:right-0 mr-2 flex items-center px-2"
      >
        <svg
          class="h-3 w-3 sm:h-4 sm:w-4 fill-current dark:text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 56.966 56.966"
        >
          <path
            d="M55.146,51.887L41.588,37.786
            c3.486-4.144,5.396-9.358,5.396-14.786
            c0-12.682-10.318-23-23-23s-23,10.318-23,23
            s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162
            l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
            c0.779,0,1.518-0.297,2.079-0.837
            C56.255,54.982,56.293,53.08,55.146,51.887z
            M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
            s-17-7.626-17-17S14.61,6,23.984,6z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>