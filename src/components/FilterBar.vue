<script setup lang="ts">
defineProps<{
  status: 'all' | 'fake' | 'not-fake'
  pageSize: number
}>()
const emit = defineEmits<{
  (e:'update:status', v:'all'|'fake'|'not-fake'):void
  (e:'update:pageSize', v:number):void
}>()
</script>


<template>
  <div class="flex flex-wrap items-center gap-3 mb-4">
    <label class="text-sm">Filter:</label>
    <select class="border rounded px-2 py-1"
            :value="status"
            @change="emit('update:status', ($event.target as HTMLSelectElement).value as any)">
      <option value="all">All</option>
      <option value="fake">Fake</option>
      <option value="not-fake">NotFake</option>
    </select>

    <label class="text-sm ml-4">PerPage:</label>
    <select class="border rounded px-2 py-1"
            :value="pageSize"
            @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))">
      <option :value="5">5</option>
      <option :value="10">10</option>
      <option :value="12">12</option>
      <option :value="20">20</option>
    </select>
  </div>
</template>
