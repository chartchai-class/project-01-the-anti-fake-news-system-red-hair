import apiClient from './AxiosClient'

export default {
  // Post a full comment with vote
  postComment(commentData: {
    id: number
    newsId: number
    author: string
    content?: string
    image?: string
    voteType: 'fake' | 'not-fake'
  }) {
    return apiClient.post('/comments', commentData)
  },

  getCommentsByNewsIdByAdmin(newsId: number, page = 1, perPage = 10) {
    const id = newsId
    const params = {
      page: page - 1,
      size: perPage,
    }
    return apiClient.get(`/admin/news/${id}/comments`, { params })
  },

  getCommentsByNewsId(newsId: number, page = 1, perPage = 10) {
    const id = newsId
    const params = {
      page: page - 1,
      size: perPage,
    }
    return apiClient.get(`/news/${id}/comments`, { params })
  },

  // Only vote without comment
  vote(newsId: number, voteType: 'fake' | 'not-fake') {
    return apiClient.post(`/news/${newsId}/vote`, { voteType })
  },

  saveComment(newsId: number, authorId: number, comment: any){
    const {id, ...newData} = comment // will handle id as increment in backend
    return apiClient.post(`/news/${newsId}/comments`, newData, { params: { authorId }})
  },

  toggleDeleteComment(id: number, isDeleted: boolean) {
    return apiClient.post(`/comments/${id}/toggle-delete`, { isDeleted })
  }
}