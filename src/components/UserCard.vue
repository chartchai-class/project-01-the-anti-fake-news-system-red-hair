<script setup lang="ts">
import type { User } from '@/types';
import BaseSelect from './BaseSelect.vue';
import { ref, watch } from 'vue';
import UserService from '@/services/UserService';


const props = defineProps<{
    user: User
}>()

const selectedRole = ref<string>(props.user.roles[0] || '');

function updateUserRole(){
    console.log('Updating user role to:', selectedRole.value);
    UserService.editUser(props.user.id, [selectedRole.value] as string[])
    .then((response) => {
        console.log('User role updated successfully', response.data);
    })
    .catch((error) => {
        console.error('Error updating user role', error);
    });
}

watch(selectedRole, () => {
    console.log('Role changed to:', selectedRole.value);
    updateUserRole();
})

</script>

<template>
    <div class="content-center text-center">{{ user.id }}</div>
    <div class="content-center text-center">{{ user.username }}</div>
        <div class="content-center text-center">{{ user.displayName }}</div>
    <div class="content-center text-center">{{ user.email }}</div>
    <div class="content-center text-center">
        <BaseSelect v-model="selectedRole" :roles="['ROLE_READER', 'ROLE_MEMBER', 'ROLE_ADMIN']" />
    </div>
</template>