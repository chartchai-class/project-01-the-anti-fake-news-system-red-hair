import type { AxiosInstance } from "axios";
import axios from 'axios'
import { defineStore } from 'pinia'
import type { User } from "@/types";

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as User | null
    }),
    getters: {
        currentUserName(): string {
            return this.user?.firstName || ''
        },
        isReader(): boolean {
            return this.user?.role.includes('ROLE_READER') || false
        },
        isMember(): boolean {
            return this.user?.role.includes('ROLE_MEMBER') || false
        },
        isAdmin(): boolean {
            return this.user?.role.includes('ROLE_ADMIN') || false
        },
        authorizationHeader(): string {
            return `Bearer ${this.token}`
        }
    },
    actions: {
        login(email: string, password: string) {
            return apiClient
            .post('/api/v1/auth/authenticate', {
                email: email,
                password: password
            })
            .then((response) => {
                this.token = response.data.access_token
                this.user = response.data.user
                localStorage.setItem('access_token', this.token as string)
                localStorage.setItem('user', JSON.stringify(this.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
                return response
            })
        },
        logout() {
            console.log('logout')
            this.token = null
            this.user = null
            localStorage.removeItem('access_token')
            localStorage.removeItem('user')
        },
        reload(token: string, user: User) {
            this.token = token
            this.user = user
        },
        register(firstName: string, lastName: string, email: string, password: string, image: string) {
            return apiClient
            .post('/api/v1/auth/register', {
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: password,
                image: image
            })
            .then(async(response) => {
                await this.login(email, password)
                return response
            })
        }
    }
})