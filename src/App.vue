<script setup lang="ts">
import { RouterView } from 'vue-router'
import 'nprogress/nprogress.css'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { mdiLogin } from '@mdi/js'
import { mdiAccount } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { useMessageStore } from './stores/message'
import { storeToRefs } from 'pinia'
const router = useRouter()
const authStore = useAuthStore()
function goHome() {
  router.push({ name: 'home' })
}
const store = useMessageStore()
const { message } = storeToRefs(store)
const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')

if(token && user) {
  authStore.reload(token, JSON.parse(user))
} else {
  authStore.logout()
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-200">
    <header class="sticky top-0 z-50 bg-black/95 border-b">
      <div class="text-center animate-fade bg-red-500" v-if="message">
        <h4>{{ message }}</h4>
      </div>
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center">
        <img @click="goHome" alt="Vue logo"
          class="hidden sm:block w-7 h-7 lg:w-9 lg:h-9 sm:w-8 sm:h-8 rounded object-cover cursor-pointer"
          src="@/assets/793535a9837c8f0e53e51ba7a0a88ade.jpg" />
        <h1 @click="goHome"
          class="text-lg lg:text-4xl sm:text-3xl font-bold mx-auto text-center sm:text-left text-white cursor-pointer">
          <span class="text-[#AB0000]">R</span>ED HAIR: ANTI FAKE NEWS SYSTEM
        </h1>
        <nav class="md:w-auto flex justify-center md:justify-end">
          
          <!-- if not logged in -->
          <ul v-if="!authStore.currentUserName" class="flex flex-wrap justify-center items-center space-x-6">
            <li>
              <router-link to="/login" class="flex items-center text-white hover:text-red-400">
                <SvgIcon class="w-5 h-5 fill-white" type="mdi" :path="mdiLogin" />
                <span class="ml-2">Login</span>
              </router-link>
            </li>
          </ul>
          
          <!-- if logged in -->
          <ul v-else class="flex flex-wrap justify-center items-center space-x-6">
            <li>
              <router-link to="/profile" class="flex items-center text-white hover:text-red-400">
                <div class="w-7 h-7 flex items-center justify-center rounded-full bg-[#AB0000]">
                  <span v-if="authStore.currentUserImage">
                    <img :src="authStore.currentUserImage" alt="Profile" class="w-7 h-7 rounded-full object-cover"/>
                  </span>
                  <span v-else >
                      <SvgIcon class="w-5 h-5 fill-white" type="mdi" :path="mdiAccount" />
                  </span>
                </div>
                <span class="ml-2">{{ authStore.currentUserName }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>