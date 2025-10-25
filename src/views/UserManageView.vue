<script setup lang="ts">
import UserCard from '@/components/UserCard.vue';
import UserService from '@/services/UserService';
import type { User } from '@/types';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const users = ref<User[] | null>(null)
const totalUsers = ref(0)

const route = useRoute()
const router = useRouter()

const page = computed(() => Number(route.query.page) || 1)
const limit = ref(Number(route.query.limit) || 5)

function updateLimit(newLimit: number) {
    router.push({
        name: 'user-manage',
        query: { page: 1, limit: newLimit }
    })
}

const hasNextPage = computed(() => {
    const totalPages = Math.ceil(totalUsers.value / limit.value)
    return page.value < totalPages
})

onMounted(() => {
    watchEffect(() => {
        UserService.getUsers(limit.value, page.value)
        .then((response) => {
            users.value = response.data
            totalUsers.value =parseInt(response.headers['x-total-count'])
        })
        .catch((error) => {
            console.error('There was an error!', error)
        })
    })
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center">
        <!-- Back button -->
        <RouterLink :to="{ name: 'home' }" class="self-start">
            <button class="bg-black text-white px-5 py-1 rounded-lg hover:bg-[#720000] ml-6 mt-6 mb-4 shadow">Back</button>
        </RouterLink>
        <h1 class="text-3xl font-bold text-center mb-6 text-black">User Management</h1>

        <div class="flex flex-col">
            <label class="m-2" for="limit-select">User Per Page:</label>
            <select id="limit-select" v-model.number="limit" @change="updateLimit(limit)" class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="15">15</option>
            </select>
        </div>
        <!-- Dropdown for selecting number of events per page -->

        <!-- Scrollable wrapper -->
        <div class="w-full sm:w-auto overflow-x-auto">
        <!-- Force a minimum width so the grid doesn’t shrink too much -->
        <div class="grid grid-cols-5 min-w-[900px] sm:min-w-full p-4">
            <!-- Header row -->
            <div class="py-2 bg-black text-white font-bold mb-5 mt-5 rounded-lg col-span-5 content-center w-full">
            <div class="grid grid-cols-5">
                <div class="text-center min-w-[180px]">ID</div>
                <div class="text-center min-w-[180px]">Username</div>
                <div class="text-center min-w-[180px]">Display Name</div>
                <div class="text-center min-w-[180px]">Gmail</div>
                <div class="text-center min-w-[180px]">Role</div>
            </div>
            </div>

            <UserCard v-for="user in users" :key="user.id" :user="user" />
        </div>
        </div>

        <div class="flex justify-between gap-4 mt-6 w-full max-w-md">
            <div :class="{ 'invisible': page <= 1 }">
                <RouterLink
                :to="{ name: 'user-manage', query: { page: page - 1, limit: limit}}"
                rel="prev"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2 text-left block"
                >&#60; Prev Page</RouterLink>
            </div>

            <div v-if="hasNextPage">
            <RouterLink
                :to="{ name: 'user-manage', query: { page: page + 1, limit: limit}}"
                rel="next"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2 text-right block"
                >Next Page &#62;</RouterLink>
            </div>
        </div>
    </div>
</template>