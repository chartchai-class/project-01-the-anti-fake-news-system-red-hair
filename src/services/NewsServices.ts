import type { filterType, News, searchType } from '@/types'
import apiClient from './AxiosClient'
import type { AxiosResponse } from 'axios'

// Don't forget to pharse datatype, especially Date object manually after getting data from server -- i removed revive function for now -- will add later
export default {
  getNews() {
    return apiClient.get('/news')
  },

  getNewsByAdmin(page: number, perPage: number, status?: filterType, searchBy?: searchType, keyword?: string): Promise<AxiosResponse<News[]>> {
    const params: Record<string, string|number> = {
      page: page - 1,
      size: perPage,
    }
    if (status && status !== 'all') params.status = status 
    if (searchBy) params.searchBy = searchBy // always send searchBy if exists
    if (keyword && keyword.trim() !== '') params.search = keyword // using like for partial match
    return apiClient.get('/admin/news', { params })
  },

  getNewsById(id: number) {
    return apiClient.get(`/news/${id}`)
  },

  getNewsByPage(page: number, perPage: number, status?: filterType, searchBy?: searchType, keyword?: string): Promise<AxiosResponse<News[]>> {
    const params: Record<string, string|number> = {
      page: page - 1,
      size: perPage,
    }
    if (status && status !== 'all') params.status = status 
    if (searchBy) params.searchBy = searchBy // always send searchBy if exists
    if (keyword && keyword.trim() !== '') params.search = keyword // using like for partial match
    return apiClient.get<News[]>('news', { params })
  },

  getNewsByKeyword(keyword: string, perPage: number, page: number): Promise<AxiosResponse<News[]>> {
    return apiClient.get<News[]>('/news?title=' + keyword + '&size=' + perPage + '&page=' + (page - 1))
  },

  saveNews(news: any){
    const {id, ...newData} = news // will handle id as increment in backend
    return apiClient.post('/news', newData)
  },

  toggleSoftDeleteNews(id: number, isDeleted: boolean) {
    return apiClient.post(`/news/${id}/toggle-delete`, { isDeleted })
  },
}
