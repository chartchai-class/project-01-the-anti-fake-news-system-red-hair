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
  isDeleted: boolean
}

export interface Comment {
  id: number
  newsId: number
  author: string
  content: string
  image: string //url
  voteType: voteType
  commentDateTime: Date
  isDeleted: boolean
}

export type filterType = 'all' | 'fake' | 'not-fake'

export type searchType = 'title' | 'description' | 'reporter'

export type voteType = 'fake' | 'not-fake'

export interface NewsState {
  news: News | null
}

export type roles = 'ROLE_READER' | 'ROLE_MEMBER' | 'ROLE_ADMIN'

export interface AuthUser{
  displayName: string
  profileImage: string
  roles: roles[]
}

export interface User {
  id: number
  username: string // wil pass from backend later
  firstName: string
  lastName: string
  displayName: string
  email: string
  phoneNumber: string
  profileImage: string
  roles: roles[]
  reportedNews: News[]
  comments: Comment[]
}

export interface MessageState {
    message: string
}

export interface UserState {
    user: User | null
}