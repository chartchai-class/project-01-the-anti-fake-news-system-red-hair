import { defineStore } from 'pinia'
import type { News, NewsState } from '@/types'

export const useNewsListStore = defineStore('newsList', {
  state: (): NewsState => ({
    news: null
  }),

  actions: {
    setNews(news: News): void {
      this.news = news
    }
  }
})
