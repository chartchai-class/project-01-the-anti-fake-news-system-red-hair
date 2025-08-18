import { defineStore } from 'pinia'
import type { News, Comment, voteType } from '@/types'
import NewsServices from '@/services/NewsServices'

// Parse to integer. Trust DB100%
const toInt = (v: any) => {
  const n = typeof v === 'number' ? v : parseInt(String(v), 10)
  return Number.isFinite(n) ? n : 0
}

function computeVoteType(fakeCount: number, notFakeCount: number): voteType {
  return fakeCount > notFakeCount ? 'fake' : 'not-fake'
}

// Normalize a raw News item from API
function revive(n: any): News {
  return {
    ...n,
    newsDateTime: new Date(n.newsDateTime),
    fakeCount: toInt(n.fakeCount),
    notFakeCount: toInt(n.notFakeCount),
    voteType: computeVoteType(toInt(n.fakeCount), toInt(n.notFakeCount)),
    comments: (n.comments ?? []).map((c: any) => ({
      ...c,
      commentDateTime: new Date(c.commentDateTime),
    })),
  }
}

function makeTempNews(input: Partial<News>): News {
  const id = -(Date.now())
  return {
    id: id,
    title: input.title ?? 'Newly Added News',
    category: input.category ?? 'General',
    reporter: input.reporter ?? 'Anonymous',
    newsDateTime: new Date(),
    description: input.description ?? '',
    content: input.content ?? '',
    image: input.image || 'https://i.pinimg.com/1200x/e7/f6/5b/e7f65bb7011717f5c09d900866fdff4a.jpg', // just hamster image xD / wow he is good gym bro!!
    fakeCount: 0,
    notFakeCount: 1,
    voteType: computeVoteType(0, 1),
    comments: []
  }
}

function makeTempComment(newsId: number, input: Partial<Comment>): Comment {
  const id = -(Date.now()) // negative ID for temp comments
  return {
    id,
    newsId,
    author: input.author ?? 'Anonymous',
    content: input.content ?? '',
    image: input.image ?? '',
    voteType: input.voteType ?? 'not-fake',
    commentDateTime: new Date(),
  }
}

type State = {
  list: News[]
  serverList: News[]
  tempList: News[]
  total: number
  serverTotal: number
  tempTotal: number
  loaded: boolean
}
// Pinia store: news list + pagination helpers.
export const useNewsListStore = defineStore('newsList', {
  state: (): State => ({ list: [], serverList: [], tempList: [], total: 0, serverTotal: 0, tempTotal: 0, loaded: false }),

  getters: {
    getById: (s) => (id: number) => {
      // First check the current combined list
      const fromList = s.list.find(n => n.id === id)
      if (fromList) return fromList

      // Then check temp list for negative IDs
      if (id < 0) {
        return s.tempList.find(n => n.id === id) ?? null
      }

      // Finally check server list for positive IDs
      return s.serverList.find(n => n.id === id) ?? null
    },
  },

  actions: {
    //  Fetch paginated list from API no more calculated
    async fetchList({ status = 'all' as 'all' | voteType, page = 1, pageSize = 12 } = {}) {
      const res = await NewsServices.getNewsByPage(page, pageSize, status)
      const revived = (res.data as any[]).map(revive)

      // Preserve local comments if already present
      for (const item of revived) {
        const existing = this.getById(item.id)
        if (existing) {
          // merge comments (keep existing temp ones)
          const existingCommentIds = new Set(existing.comments.map(c => c.id))
          item.comments = [
            ...existing.comments,
            ...item.comments.filter(c => !existingCommentIds.has(c.id)),
          ]

          // ✅ preserve locally updated counts
          item.fakeCount = existing.fakeCount
          item.notFakeCount = existing.notFakeCount

          // ✅ recompute voteType
          item.voteType = computeVoteType(item.fakeCount, item.notFakeCount)
        }
      }
      const totalHeader =
        (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count']) as string | undefined
      const total = totalHeader ? Number(totalHeader) : revived.length

      this.serverList = revived
      this.serverTotal = Number.isFinite(total) ? total : revived.length
      this.loaded = true
    },

    async fetchOne(id: number) {
      const { data } = await NewsServices.getNewsById(id)
      return revive(data) // use DB values as-is
    },

    // Pls dont read with tears -- I somehow messed up your code and fetch from here
    // fetch both server data + temp news data
    async fetchOverallTotal({ status = 'all' as 'all' | voteType, page = 1, pageSize = 12 } = {}) {
      await this.fetchList({ status, page, pageSize })

      // filter temp by current status before combining
      const tempFiltered = status === 'all' ? this.tempList : this.tempList.filter(n => n.voteType === status)
      this.tempTotal = tempFiltered.length
      this.total = this.serverTotal + this.tempTotal

      // how many slots remain on this page after server items
      const remainingSlots = Math.max(0, pageSize - this.serverList.length)
      // offset for temp items if server already filled previous pages
      const offset = Math.max(0, (page - 1) * pageSize - this.serverTotal)
      const tempItems = remainingSlots > 0 ? tempFiltered.slice(offset, offset + remainingSlots) : []

      // combine: server first, then temp for this page
      this.list = [...this.serverList, ...tempItems]
    },

    addNews(input: Partial<News>) {
      const temp = makeTempNews(input)
      this.tempList.push(temp)
      this.tempTotal++
      return temp
    },

    // commentpart didt work in mainpage form design but it look good dont want to get rid of it
    // addComment(newsId: number, payload: Omit<Comment,'id'|'newsId'|'commentDateTime'>) {
    //   const n = this.list.find(x => x.id === newsId); if (!n) return
    //   const nextId = Math.max(0, ...n.comments.map(c => c.id)) + 1
    //   n.comments.push({ id: nextId, newsId, commentDateTime: new Date(), ...payload })
    // },

    addComment(newsId: number, input: Partial<Comment>) {
      const news = this.getById(newsId)
      if (!news) return null

      // create temp comment
      const temp = makeTempComment(newsId, input)

      // push to related news’ comments
      news.comments.push(temp)

      // ✅ update counts
      if (temp.voteType === 'fake') {
        news.fakeCount++
      } else {
        news.notFakeCount++
      }

      // ✅ recompute voteType
      news.voteType = computeVoteType(news.fakeCount, news.notFakeCount)

      return temp
    }, 
    voteFake(newsId: number) {
      const news = this.getById(newsId)
      if (!news) return
      news.fakeCount++
      news.voteType = computeVoteType(news.fakeCount, news.notFakeCount)
    },

    voteNotFake(newsId: number) {
      const news = this.getById(newsId)
      if (!news) return
      news.notFakeCount++
      news.voteType = computeVoteType(news.fakeCount, news.notFakeCount)
    }
  },
})
