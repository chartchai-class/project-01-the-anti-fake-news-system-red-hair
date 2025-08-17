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

function makeTempNews(input: Partial<News>): News{
  const id = -(Date.now())
  return{
    id: id,
    title: input.title ?? 'Newly Added News',
    category: input.category ?? 'General',
    reporter: input.reporter ?? 'Anonymous',
    newsDateTime: new Date(),
    description: input.description ?? '',
    content: input.content ?? '',
    image: input.image || 'https://i.pinimg.com/1200x/e7/f6/5b/e7f65bb7011717f5c09d900866fdff4a.jpg', //just hamster image xD
    fakeCount: 0,
    notFakeCount: 1,
    voteType: 'not-fake',
    comments: []
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
      const tempItems = this.list.filter(n => n.id < 0)

      const totalHeader =
        (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count']) as string | undefined
      const total = totalHeader ? Number(totalHeader) : revived.length

      this.list = [...tempItems, ...revived]
      this.total = (Number.isFinite(total) ? total : revived.length) + tempItems.length
      this.loaded = true
    },

    async fetchOne(id: number) {
      const { data } = await NewsServices.getNewsById(id)
      return revive(data) // ใช้ค่าจาก DB ตรง ๆ
    },

    addNews(input: Partial<News>) {
      const temp = makeTempNews(input)
      this.list.unshift(temp)
      this.total = (this.total ?? 0) + 1
      return temp
    },

    // commentpart didt work in mainpage form design but it look good dont want to get rid of it
    addComment(newsId: number, payload: Omit<Comment,'id'|'newsId'|'commentDateTime'>) {
      const n = this.list.find(x => x.id === newsId); if (!n) return
      const nextId = Math.max(0, ...n.comments.map(c => c.id)) + 1
      n.comments.push({ id: nextId, newsId, commentDateTime: new Date(), ...payload })
    },
  },
})
