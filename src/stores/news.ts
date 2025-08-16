import { defineStore } from 'pinia'
import type { News, Comment, voteType } from '@/types'

type NewsListState = { list: News[]; loaded: boolean }
const LS_KEY = 'news:list:v1'

function reviveNews(raw:any[]): News[] {
  return (raw ?? []).map(n => ({
    ...n,
    newsDateTime: new Date(n.newsDateTime),
    comments: (n.comments ?? []).map((c:any)=> ({ ...c, commentDateTime: new Date(c.commentDateTime) })),
  }))
}
function saveNews(list:News[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list.map(n => ({
    ...n,
    newsDateTime: n.newsDateTime.toISOString(),
    comments: n.comments.map(c => ({ ...c, commentDateTime: c.commentDateTime.toISOString() })),
  }))))
}
function genMock(count=28): News[] {
  const out: News[] = []
  const now = Date.now()
  const cats = ['Politics, Economy, Entertainment, Sports']
  let commentId = 1
  for (let i=1;i<=count;i++){
    const base: News = {
      id:i, title:`Newsnumbers #${i}`, category: cats[i%cats.length],
      reporter:`reporter${(i%5)+1}`, newsDateTime:new Date(now - i*3600_000),
      description:`Newssummary #${i}`, content:`Newdescription #${i}`,
      image:`https://picsum.photos/seed/n${i}/900/480`,
      fakeCount:0, notFakeCount:0, voteType: (i%2===0?'fake':'not-fake'), comments:[]
    }
    const k = 3 + (i%3) // 3..5 คอมเมนต์
    for(let j=0;j<k;j++){
      const ch:voteType = (j%2===0)?'fake':'not-fake'
      const c: Comment = {
        id: commentId++, newsId: base.id, author:`member${(j%4)+1}`,
        content:`Comment  ${j+1} For news #${base.id}`,
        image: j===0 ? `https://picsum.photos/seed/c${commentId}/600/360` : '',
        voteType: ch, commentDateTime: new Date(now - i*3600_000 - j*900_000)
      }
      base.comments.push(c)
      if (ch==='fake') base.fakeCount++; else base.notFakeCount++
    }
    if (base.fakeCount > base.notFakeCount) base.voteType = 'fake'
    else if (base.notFakeCount > base.fakeCount) base.voteType = 'not-fake'
    out.push(base)
  }
  return out
}

export const useNewsListStore = defineStore('newsList', {
  state: ():NewsListState => ({ list: [], loaded: false }),

  getters: {
    getById: (s) => (id:number) => s.list.find(n => n.id===id) ?? null,
    filtered: (s) => (status:'all'|'fake'|'not-fake') =>
      status==='all' ? s.list : s.list.filter(n => n.voteType === status),
  },

  actions: {
    /** ←← อันนี้แหละที่ Home เรียก */
    initIfNeeded() {
      if (this.loaded) return
      const raw = localStorage.getItem(LS_KEY)
      if (raw) this.list = reviveNews(JSON.parse(raw))
      else { this.list = genMock(28); saveNews(this.list) }
      this.loaded = true
    },

    addComment(newsId:number, payload: Omit<Comment,'id'|'newsId'|'commentDateTime'>){
      const n = this.getById(newsId); if(!n) return
      const c: Comment = { id:(n.comments.at(-1)?.id ?? 0)+1, newsId, commentDateTime:new Date(), ...payload }
      n.comments.push(c)
      if (c.voteType==='fake') n.fakeCount++; else n.notFakeCount++
      if (n.fakeCount > n.notFakeCount) n.voteType = 'fake'
      else if (n.notFakeCount > n.fakeCount) n.voteType = 'not-fake'
      saveNews(this.list)
    },
  },
})
