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
}]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
