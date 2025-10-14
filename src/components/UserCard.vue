<script setup lang="ts">
import type { User } from '@/types';
import BaseSelect from './BaseSelect.vue';
import { ref, computed } from 'vue';


const props = defineProps<{
    user: User
}>()

const selectedRole = ref<string>(props.user.roles[0] || '');
const userRoles = computed(() => props.user.roles);

</script>

<template>
    <div class="text-center">{{ user.id }}</div>
    <div class="text-center">{{ user.username }}</div>
    <div class="text-center">{{ user.email }}</div>
    <div v-for="role in user.roles" :key="role" :src=role class="text-center">{{ role }}</div>
    <div class="text-center">
        <BaseSelect v-model="selectedRole" :roles="['ROLE_READER', 'ROLE_MEMBER', 'ROLE_ADMIN']" />
    </div>
</template>