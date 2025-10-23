<script setup lang="ts">
const modelValue = defineModel()
// interface BaseInputProps {
//     label: string
// }
// const props = withDefaults(defineProps<BaseInputProps>(), { label: ''})
</script>

<template>
    <!-- <label v-if="label">
        {{  props.label }}
    </label> -->
    <input class="" v-bind="$attrs" v-model="modelValue">
</template>