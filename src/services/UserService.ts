import apiClient from "./AxiosClient"

export default {
    getAllUsers() {
        return apiClient.get('/users')
    },
    getUsers(perPage: number, page: number) {
        return apiClient.get('/users?_limit=' + perPage + '&_page=' + page)
    },
    getUser(id: number) {
        return apiClient.get('users/' + id)
    }
}