<script setup lang="ts">

const modelValue = defineModel()
interface BaseSelectProps {
    roles: ['ROLE_READER', 'ROLE_MEMBER', 'ROLE_ADMIN']
}

const props = defineProps<BaseSelectProps>()
</script>

<template>
    <select class="m-3" v-bind="$attrs" v-model="modelValue">
        <option
            v-for="role in props.roles"
            :key="role"
            :value="role"
            :selected="role === modelValue">
            {{ role }}
        </option>
    </select>
</template>