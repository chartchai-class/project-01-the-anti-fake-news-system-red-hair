import type { AxiosInstance } from "axios";
import axios from 'axios'
import { defineStore } from 'pinia'
import type { AuthUser, User } from "@/types";

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
        user: null as AuthUser | null
    }),
    getters: {
        currentUserName(): string {
            return this.user?.displayName || ''
        },
        currentUserImage(): string {
            return this.user?.profileImage || ''
        },
        isReader(): boolean {
            return this.user?.roles.includes('ROLE_READER') || false
        },
        isMember(): boolean {
            return this.user?.roles.includes('ROLE_MEMBER') || false
        },
        isAdmin(): boolean {
            return this.user?.roles.includes('ROLE_ADMIN') || false
        },
        isAuthenticated(): boolean {
            const isAuthenticated = this.token !== null || this.token !== ""
            console.log("isAuthenticated: " + isAuthenticated)
            return isAuthenticated
        },
        authorizationHeader(): string {
            return `Bearer ${this.token}`
        }
    },
    actions: {
        login(username: string, password: string) {
            return apiClient
            .post('/api/v1/auth/authenticate', {
                username: username,
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
        register(username: string, firstName: string, lastName: string, displayName: string, email: string, password: string, profileImage: string, phoneNumber: string) {
            return apiClient
            .post('/api/v1/auth/register', {
                username: username,
                firstName: firstName,
                lastName: lastName,
                displayName: displayName,
                email: email,
                password: password,
                profileImage: profileImage,
                phoneNumber: phoneNumber
            })
            .then(async(response) => {
                this.token = response.data.access_token
                this.user = response.data.user
                localStorage.setItem('access_token', this.token as string)
                localStorage.setItem('user', JSON.stringify(this.user))
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
                return response
            })
        }
    }
})