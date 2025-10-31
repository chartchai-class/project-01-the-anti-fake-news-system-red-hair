<script setup lang="ts">
    import Uploader from 'vue-media-upload'
    import { ref, computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';

    interface Props{
        modelValue?: string[]
    }

    const authStore = useAuthStore();
    const authorizationHeader = computed(() =>{
        return { authorization: authStore.authorizationHeader }
    });

    const props = withDefaults(defineProps<Props>(), {
        modelValue: () => []
    });
    const convertStringToMedia = (str: string[]): any => {
        return str.map((element: string) => {
            return {
                name: element
            }
        })
    } 
    const emit = defineEmits(['update:modelValue']);
    const convertMediaToString = (media: any[]): string[] =>{
        const output: string[] = [];
        media.forEach((element: any) => {
            output.push(element.name);
        });
        return output;
    }

    const media = ref(convertStringToMedia(props.modelValue));
    const uploadUrl = ref(import.meta.env.VITE_UPLOAD_URL)
    const onChanged = (file: any) => {
        emit('update:modelValue', convertMediaToString(file));
    }
</script>

<template>
    <Uploader :server="uploadUrl" @change="onChanged" :media="media" :headers="authorizationHeader"></Uploader>
</template>
