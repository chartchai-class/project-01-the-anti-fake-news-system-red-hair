<script setup lang="ts">
import type { User } from '@/types';
import BaseSelect from './BaseSelect.vue';
import { ref } from 'vue';

const props = defineProps<{
    user: User
}>()

const selectedRole = ref<string>(props.user.roles[0] || '');

</script>

<template>
    <div class="content-center text-center">{{ user.id }}</div>
    <div class="content-center text-center">{{ user.displayName }}</div>
    <div class="content-center text-center">{{ user.username }}</div>
    <div class="content-center text-center">{{ user.email }}</div>
    <div class="content-center text-center">
        <BaseSelect v-model="selectedRole" :roles="['ROLE_READER', 'ROLE_MEMBER', 'ROLE_ADMIN']" />
    </div>
</template>