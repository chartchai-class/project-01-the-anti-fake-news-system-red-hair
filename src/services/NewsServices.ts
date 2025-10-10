import axios from 'axios'
const BASE = 'https://cbsd-news-mock.onrender.com'

const apiClient = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Don't forget to pharse datatype, especially Date object manually after getting data from server -- i removed revive function for now -- will add later
export default {
  getNews() {
    return apiClient.get('/news')
  },

  getNewsById(id: number) {
    return apiClient.get(`/news/${id}`)
  },

  // getNewsByPage(page: number, perPage: number, status?: 'fake'|'not-fake'|'all') {
  //   const params: Record<string, string|number> = {
  //     _page: page,
  //     _limit: perPage,
  //     t: Date.now(),
  //   }
  //   if (status && status !== 'all') params.voteType = status
  //   return apiClient.get('news', { params })
  // },

  getNewsByPage(page: number, perPage: number){
    return apiClient.get('news', {
      params: {
        _page: page,
        _limit: perPage,
      }
    })
  }
}
