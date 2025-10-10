import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostNews from '@/views/PostNews.vue'
import NewsDetailView from '@/views/NewsDetailView.vue'
import nProgress from 'nprogress'
import { useNewsListStore } from '@/stores/news'
import type { News } from '@/types'
import NewsServices from '@/services/NewsServices'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
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
      props: true,
      beforeEnter: (to) => {
        const id = parseInt(to.params.id as string)
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
          component: () => import('@/views/CommentListView.vue'),
          props: true
        },
        {
          path: 'post-comment',
          name: 'post-comment',
          component: () => import('@/views/PostComments.vue'),
          props: route => ({ newsId: Number(route.params.id) })
        }
      ]
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
