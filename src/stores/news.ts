import { defineStore } from 'pinia'
import type { News, Comment, voteType } from '@/types'
import NewsServices from '@/services/NewsServices'

// Parse to integer. Trust DB100%
const toInt = (v: any) => {
  const n = typeof v === 'number' ? v : parseInt(String(v), 10)
  return Number.isFinite(n) ? n : 0
}
// Normalize a raw News item from API
function revive(n: any): News {
  return {
    ...n,
    newsDateTime: new Date(n.newsDateTime),
    fakeCount: toInt(n.fakeCount),
    notFakeCount: toInt(n.notFakeCount),
    voteType: n.voteType === 'fake' || n.voteType === 'not-fake' ? n.voteType : 'not-fake',
    comments: (n.comments ?? []).map((c: any) => ({
      ...c,
      commentDateTime: new Date(c.commentDateTime),
    })),
  }
}

type State = {
  list: News[]
  total: number
  loaded: boolean
}
// Pinia store: news list + pagination helpers.
export const useNewsListStore = defineStore('newsList', {
  state: (): State => ({ list: [], total: 0, loaded: false }),

  getters: {
    getById: (s) => (id: number) => s.list.find(n => n.id === id) ?? null,
  },

  actions: {
    //  Fetch paginated list from API no more calculated
    async fetchList({ status='all' as 'all'|voteType, page=1, pageSize=12 } = {}) {
      const res = await NewsServices.getNewsByPage(page, pageSize, status)
      const revived = (res.data as any[]).map(revive)

      const totalHeader =
        (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count']) as string | undefined
      const total = totalHeader ? Number(totalHeader) : revived.length

      this.list = revived
      this.total = Number.isFinite(total) ? total : revived.length
      this.loaded = true
    },

    async fetchOne(id: number) {
      const { data } = await NewsServices.getNewsById(id)
      return revive(data) // ใช้ค่าจาก DB ตรง ๆ
    },

    // commentpart didt work in mainpage form design but it look good dont want to get rid of it
    addComment(newsId: number, payload: Omit<Comment,'id'|'newsId'|'commentDateTime'>) {
      const n = this.list.find(x => x.id === newsId); if (!n) return
      const nextId = Math.max(0, ...n.comments.map(c => c.id)) + 1
      n.comments.push({ id: nextId, newsId, commentDateTime: new Date(), ...payload })
    },
  },
})
