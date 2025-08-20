import axios from 'axios'

// repo URL donot contain /new
const BASE = 'https://cbsd-news-mock-production.up.railway.app'


// Shared axios instance
const apiClient = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  //  Get all news (no pagination)
  getNews() {
    return apiClient.get('news', { params: { t: Date.now() } })
  },

  //  Get single news by id.
  getNewsById(id: number) {
    return apiClient.get(`news/${id}`, { params: { t: Date.now() } })
  },

  // Server-side pagination + filter
  getNewsByPage(page: number, perPage: number, status?: 'fake'|'not-fake'|'all') {
    const params: Record<string, string|number> = {
      _page: page,
      _limit: perPage,
      t: Date.now(),
    }
    if (status && status !== 'all') params.voteType = status
    return apiClient.get('news', { params })
  },
}
