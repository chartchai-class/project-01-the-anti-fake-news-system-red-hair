import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostNews from '@/views/PostNews.vue'
import NewsDetailView from '@/views/NewsDetailView.vue'
import CommentListView from '@/views/CommentListView.vue'
import PostComments from '@/views/PostComments.vue'
import nProgress from 'nprogress'
import { useNewsListStore } from '@/stores/news'
import type { News } from '@/types'
import NewsServices from '@/services/NewsServices'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import UserManageView from '@/views/UserManageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path:'/post-news',
      name: 'post-news',
      component: PostNews
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetailView,
      props: route => ({ id: Number(route.params.id) }),
      beforeEnter: (to) => {
        const id = Number(to.params.id)
        const newsStore = useNewsListStore()
        return NewsServices.getNewsById(id)
          .then((response) => {
            newsStore.setNews(response.data as News)
          })
          .catch((error) => {
            // will fix later for error view
            console.error('Failed to fetch news item:', error)
            return { name: 'home'}
          })
      },
      children: [
        {
          path: 'view-comments',
          name: 'view-comments',
          component: CommentListView,
          props: route => ({ id: Number(route.params.id) })
        },
        {
          path: 'post-comment',
          name: 'post-comment',
          component: PostComments,
          props: route => ({ newsId: Number(route.params.id) })
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/user-manage',
      name: 'user-manage',
      component: UserManageView
    }
  ],
})

router.beforeEach(()=>{
  nProgress.start()
})
router.afterEach(()=>{
  nProgress.done()
})

export default router
