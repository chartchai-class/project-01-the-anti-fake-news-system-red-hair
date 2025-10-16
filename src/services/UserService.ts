import apiClient from '@/services/AxiosClient'

export default {
    getAllUsers() {
        return apiClient.get('/users/profiles')
    },
    getUsers(perPage: number, page: number) {
        return apiClient.get('/users/profiles?_limit=' + perPage + '&_page=' + page)
    },
    getUserProfile() {
        return apiClient.get('/profiles/me')
    },
    editUser(id: number, roles: string[]) {
        return apiClient.put(`/users/profiles/${id}`, roles)
    }
}