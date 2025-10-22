<script setup lang="ts">
    defineProps({
        show: { 
            type: Boolean, 
            required: true 
        },
        title: { 
            type: String,
            default: 'Notification' 
        },
        message: { 
            type: String, 
            default: '' 
        },
        type: { //use success and error
            type: String, 
            default: 'success' 
        }, 
        confirmText: { 
            type: String, 
            default: 'OK' 
        }
    })

    const emit = defineEmits(['close','confirm'])

    function onClose(){ 
        emit('close') 
    }
    function onConfirm(){ 
        emit('confirm'); 
        onClose() 
    }
</script>


<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black/40" @click="onClose">
    <div class="bg-white rounded-lg max-w-sm w-full p-6 shadow-lg" @click.stop>
      <div class="mb-4 flex items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p class="text-sm text-gray-600 mt-2">{{ message }}</p>
        </div>
      </div>
      <div class="flex justify-end">
        <button @click="onConfirm" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>