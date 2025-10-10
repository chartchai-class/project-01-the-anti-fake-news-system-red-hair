export interface News {
  id: number
  title: string
  category: string
  reporter: string
  newsDateTime: Date
  description: string
  content: string
  image: string //url
  fakeCount: number
  notFakeCount: number
  voteType: voteType
  comments: Comment[]
}

export interface Comment {
  id: number
  newsId: number
  author: string
  content: string
  image: string //url
  voteType: voteType
  commentDateTime: Date
}

export type filterType = 'all' | 'fake' | 'not-fake'

export type voteType = 'fake' | 'not-fake'

export interface NewsState {
  news: News | null
}
