<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import UserService from '@/services/UserService'
import type { User } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const user = ref<User | null>(null)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
  }
  UserService.getUserProfile()
  .then((response) => {
    console.log("Fetched user profile:", response.data)
    user.value = response.data
  })
  .catch((error) => {
    console.error("Error fetching user profile:", error)
  })
})

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}

// editProfile is optional
function editProfile() {
  router.push({ name: 'edit-profile' }) 
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
    
    <!-- Back button -->
    <RouterLink :to="{ name: 'home' }" class="self-start">
        <button class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 sm:ml-32 mt-6 mb-4 shadow">Back</button>
    </RouterLink>
    
    <!-- Profile Card -->
    <div class="flex  items-center justify-center p-3">
        <div class="w-auto sm:w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h1 class="text-3xl font-bold text-center mb-6 text-black"><span class="text-[#AB0000]">P</span>rofile</h1>
            <div class="grid gap-2 sm:gap-5 text-gray-700 text-left">
                <div class="flex flex-row flex-wrap justify-center">
                  <img :src="user?.profileImage || 'https://i.pinimg.com/736x/54/3c/31/543c3130fba0be6cfda40c0db5fe74c1.jpg'" alt="events image" class="border-solid border-gray-200 border-2 rounded p-1 m-1 w-40 h-40 hover:shadow-lg object-cover">
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">First Name</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1"> {{ user?.firstName }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">Last Name</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1"> {{ user?.lastName }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">User Name</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1"> {{ user?.username }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">Display Name</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1"> {{ user?.displayName }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">Email</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1">{{ user?.email }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">Phone Number</p>
                    <p class="text-sm sm:text-lg font-semibold text-gray-900 flex-1">{{ user?.phoneNumber }}</p>
                </div>
                <div class="flex items-center h-10">
                    <p class="text-xs sm:text-sm text-gray-500 mb-0 flex-1 w-48 sm:ml-3 ml-5">Role(s)</p>
                    <div class="flex flex-col flex-1">
                      <p v-for="role in user?.roles" :key="role" class="text-sm sm:text-lg font-semibold text-gray-900">{{ role }}</p>
                    </div>                    
                </div>
                <div class="flex justify-between mt-4 w-full max-w-lg mx-auto">
                  <button class="bg-black text-white px-2 py-2 rounded-full hover:bg-[#720000] shadow flex-1 mx-2" @click="editProfile">Edit</button>
                  <button class="bg-black text-white px-2 py-2 rounded-full hover:bg-[#720000] shadow flex-1 mx-2" @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

