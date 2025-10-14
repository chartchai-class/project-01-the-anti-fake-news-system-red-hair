<script setup lang="ts">
    import Uploader from 'vue-media-upload'
    import { ref } from 'vue';

    interface Props{
        modelValue?: string
    }
    const props = withDefaults(defineProps<Props>(), {
        modelValue: ''
    });

    const convertStringToMedia = (str: string): any[] => {
        if(!str) return [];
        return [{name: str}];
    }
    const emit = defineEmits(['update:modelValue']);
    const convertMediaToString = (media: any[]): string => {
        return media[0].name;
    }

    const media = ref(convertStringToMedia(props.modelValue));
    const uploadUrl = ref(import.meta.env.VITE_UPLOAD_URL);

    const onChanged = (files: any[]) => {
        emit('update:modelValue', convertMediaToString(files));
    }
</script>

<template>
    <Uploader 
        :server="uploadUrl" 
        @change="onChanged" 
        :media="media"
        :multiple="false"
        :max="1"
    ></Uploader>
</template>
