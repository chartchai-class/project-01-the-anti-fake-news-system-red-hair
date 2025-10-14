<script setup lang="ts">
import type { User } from '@/types';

defineProps<{
    user: User
}>()
</script>

<template>
    <div class="text-center">{{ user.id }}</div>
    <div class="text-center">{{ user.username }}</div>
    <div class="text-center">{{ user.email }}</div>
    <div v-for="role in user.roles" :key="role" :src=role class="text-center">{{ role }}</div>
    <div class="text-center">EDIT</div>
</template>