<script setup lang="ts">
import type { User } from '@/types';
import BaseSelect from './BaseSelect.vue';
import { ref, watch } from 'vue';
import UserService from '@/services/UserService';
import AlertBox from '@/components/AlertBox.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    user: User
}>()
const router = useRouter();
const selectedRole = ref<string>(props.user.roles[0] || '');
const previousRole = ref<string>(selectedRole.value); // store old role

const alertBox = ref({
  show: false,
  title: 'Notification',
  message: '',
  type: 'success' as 'success' | 'error'
});

function updateUserRole(){
    console.log('Updating user role to:', selectedRole.value);
    if(props.user.username == "admin" && props.user.roles.includes("ROLE_ADMIN")) {
        alertBox.value.show = true;
        alertBox.value.title = 'Error';
        alertBox.value.message = 'Original admin cannot delete himself';
        alertBox.value.type = 'error';
        selectedRole.value = previousRole.value;
        return
    }
    UserService.editUser(props.user.id, [selectedRole.value] as string[])
    .then((response) => {
        console.log('User role updated successfully', response.data);
        alertBox.value.show = true;
        alertBox.value.title = 'Success';
        alertBox.value.message = 'User role updated successfully!';
        alertBox.value.type = 'success';
        previousRole.value = selectedRole.value;
    })
    .catch((error) => {
        console.error('Error updating user role', error);
        alertBox.value.show = true;
        alertBox.value.title = 'Error';
        alertBox.value.message = 'Failed to update user role. Please try again.';
        alertBox.value.type = 'error';
        selectedRole.value = previousRole.value;
    });
}

function onModalConfirm() {
  alertBox.value.show = false;
  if (alertBox.value.type === 'success') {
    // Redirect back to the user-manage page
    router.push({ name: 'user-manage' });
  }
}

watch(selectedRole, () => {
    console.log('Role changed to:', selectedRole.value);
    updateUserRole();
})

</script>

<template>
    <AlertBox
    :show="alertBox.show"
    :title="alertBox.title"
    :message="alertBox.message"
    :type="alertBox.type"
    confirmText="OK"
    @confirm="onModalConfirm"
    @close="alertBox.show = false"
    />
    <div class="content-center text-center">{{ user.id }}</div>
    <div class="content-center text-center">{{ user.username }}</div>
        <div class="content-center text-center">{{ user.displayName }}</div>
    <div class="content-center text-center">{{ user.email }}</div>
    <div class="content-center text-center">
        <BaseSelect v-model="selectedRole" :roles="['ROLE_READER', 'ROLE_MEMBER', 'ROLE_ADMIN']" :disabled="user.username == 'admin'" />
    </div>
</template>