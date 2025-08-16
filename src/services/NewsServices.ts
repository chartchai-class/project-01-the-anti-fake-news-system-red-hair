import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://my-json-server.typicode.com/sawroryyin/331-02d/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getNews() {
    return apiClient.get('/news/')
  },
  getNewsById(id: number) {
    return apiClient.get('/news/' + id)
  },
  getNewsByPage(page: number, perPage: number) {
    return apiClient.get(`/news?_page=${page}&_limit=${perPage}`)
  },
}
