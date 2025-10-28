<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InputText from '@/components/InputText.vue'
import SingleImageUpload from '@/components/SingleImageUpload.vue'
import AlertBox from '@/components/AlertBox.vue'
import UserService from '@/services/UserService'
import { useAuthStore } from '@/stores/auth'
import type { EditUser } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const user = ref<EditUser>({
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  profileImage: '',
  phoneNumber: ''
})

const originalUser = ref({ ...user.value }) // for comparison to able/disable save changes button
const alertBox = ref({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error'
})

onMounted(() => {
  UserService.getUserProfile()
    .then((res) => {
      user.value = { ...res.data }
      originalUser.value = { ...res.data }
    })
    .catch((err) => {
      console.error('Error fetching user:', err)
      alertBox.value = {
        show: true,
        title: 'Error',
        message: 'Failed to load user profile.',
        type: 'error'
      }
    })
})

const isChanged = computed(() => {
  // to check if any field change
  return Object.keys(user.value).some(
    (key) => user.value[key as keyof typeof user.value] !== originalUser.value[key as keyof typeof originalUser.value]
  )
})

function saveChanges() {
  if (!isChanged.value) return
  UserService.updateUserProfile(user.value)
    .then(() => {
      alertBox.value = {
        show: true,
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        type: 'success'
      }
      originalUser.value = { ...user.value }
      if (authStore.user) {
        authStore.user.displayName = user.value.displayName
        authStore.user.profileImage = user.value.profileImage
        localStorage.setItem('user', JSON.stringify(authStore.user))
        }
    })
    .catch((err) => {
      console.error(err)
      alertBox.value = {
        show: true,
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        type: 'error'
      }
    })
}

function onModalConfirm() {
  alertBox.value.show = false
  if (alertBox.value.type === 'success') {
    router.push({ name: 'profile' })
  }
}
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

  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
    <!-- Back button -->
    <RouterLink :to="{ name: 'profile' }" class="self-start">
      <button class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 sm:ml-32 mt-6 mb-4 shadow">Back</button>
    </RouterLink>

    <div class="flex items-center justify-center p-3">
      <div class="w-auto sm:w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 class="text-3xl font-bold text-center mb-6 text-black"><span class="text-[#AB0000]">E</span>dit Profile</h1>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <InputText type="text" v-model="user.firstName" placeholder="First Name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <InputText type="text" v-model="user.lastName" placeholder="Last Name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Display Name</label>
            <InputText type="text" v-model="user.displayName" placeholder="Display Name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <InputText type="text" v-model="user.email" placeholder="Email" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <InputText type="text" v-model="user.phoneNumber" placeholder="Phone Number" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Profile Image</label>
            <SingleImageUpload v-model="user.profileImage" />
          </div>
        </div>

        <div class="flex justify-center mt-8">
          <button
            class="bg-black text-white px-6 py-2 rounded-full hover:bg-[#720000] shadow disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isChanged"
            @click="saveChanges"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>