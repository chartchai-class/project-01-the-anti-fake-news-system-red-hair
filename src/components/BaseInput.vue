<script setup lang="ts">
    const modelValue = defineModel()
</script>

<template>
    <input class="" v-bind="$attrs" v-model="modelValue">
</template>