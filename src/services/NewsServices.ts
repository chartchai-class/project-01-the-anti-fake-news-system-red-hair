import type { filterType, News, searchType } from '@/types'
import apiClient from './AxiosClient'
import type { AxiosResponse } from 'axios'

// Don't forget to pharse datatype, especially Date object manually after getting data from server -- i removed revive function for now -- will add later
export default {
  getNews() {
    return apiClient.get('/news')
  },

  getNewsById(id: number) {
    return apiClient.get(`/news/${id}`)
  },

  getNewsByPage(page: number, perPage: number, status?: filterType, searchBy?: searchType) {
    const params: Record<string, string|number> = {
      _page: page,
      _limit: perPage,
    }
    if (status && status !== 'all') params.voteType = status
    if (searchBy && searchBy !== 'title') params.searchBy = searchBy
    return apiClient.get('news', { params })
  },

  getNewsByKeyword(keyword: string, perPage: number, page: number): Promise<AxiosResponse<News[]>> {
    return apiClient.get<News[]>('/news?title=' + keyword + '&_limit=' + perPage + '&_page=' + page)
  },

  saveNews(news: News){
    const {id, ...newData} = news // will handle id as increment in backend
    return apiClient.post('/news', newData)
  },

  deleteNews(id: number) { // currently not used
    return apiClient.delete(`/news/${id}`)
  }
}
