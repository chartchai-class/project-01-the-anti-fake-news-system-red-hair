<script setup lang="ts">
import type { filterType } from '@/types'
defineProps<{
  status: filterType
  pageSize: number
}>()
const emit = defineEmits<{
  (e:'update:status', v:filterType):void
  (e:'update:pageSize', v:number):void
}>()
</script>


<template>
  <div class="flex flex-wrap items-center gap-2 sm:gap-3">
    <label class="text-[11px] sm:text-sm">FILTER:</label>
    <select class="text-[11px] sm:text-base border-2 border-gray-500 rounded-full py-1 h-8 sm:h-10 appearance-none leading-none align-middle"
            :value="status"
            @change="emit('update:status', ($event.target as HTMLSelectElement).value as any)">
      <option value="all">All</option>
      <option value="fake">Fake</option>
      <option value="not-fake">NotFake</option>
    </select>

    <label class="text-[11px] sm:text-sm ml-4">PAGE-SIZE:</label>
    <select class="text-[11px] sm:text-base border-2 border-gray-500 rounded-full px-5 py-1 w-20 h-8 sm:h-10 appearance-none leading-none align-middle"
            :value="pageSize"
            @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))">
      <option :value="6">6</option>
      <option :value="9">9</option>
      <option :value="12">12</option>
      <option :value="18">18</option>
    </select>
  </div>
</template>
