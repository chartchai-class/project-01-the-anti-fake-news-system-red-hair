<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ total: number; page: number; pageSize: number }>()
const emit = defineEmits<{ (e:'update:page', v:number):void }>()
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
function to(p:number){
  const x = Math.min(totalPages.value, Math.max(1, p))
  emit('update:page', x)
}
</script>

<template>
  <div class="flex items-center gap-2 justify-center mt-6">
    <button class="px-3 py-1 rounded bg-gray-200" @click="to(page-1)" :disabled="page<=1">Prev</button>
    <span class="text-sm">Page {{ page }} / {{ totalPages }}</span>
    <button class="px-3 py-1 rounded bg-gray-200" @click="to(page+1)" :disabled="page>=totalPages">Next</button>
  </div>
</template>
