import { defineStore } from 'pinia'
import type { Comment, CommentState } from '@/types'

export const useCommentListStore = defineStore('commentList', {
  state: (): CommentState => ({
    commentList: null,
    totalComments: 0
  }),

  actions: {
    setCommentList(commentList: Comment[]): void {
      this.commentList = commentList
    }
  }
})
