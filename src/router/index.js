import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/sellerPage'
}, {
  path: '/sellerPage',
  name: 'SellerPage',
  component: () => import('@/views/SellerPage')
}, {
  path: '/trendPage',
  name: 'TrendPage',
  component: () => import('@/views/TrendPage')
}, {
  path: '/mapPage',
  name: 'MapPage',
  component: () => import('@/views/mapPage')
}, {
  path: '/rankPage',
  name: 'RankPae',
  component: () => import('@/views/rankPage')
}]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
