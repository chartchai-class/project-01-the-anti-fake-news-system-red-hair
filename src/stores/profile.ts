import type { User, UserState } from "@/types";
import { defineStore } from "pinia";

export const useUserProfileStore = defineStore('userProfile', {
    state: (): UserState => ({
        user: null
    }),

    actions: {
        setUsers(user: User): void {
            this.user = user
        }
    }
})
