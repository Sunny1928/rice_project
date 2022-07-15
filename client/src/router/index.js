import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Customer from '@/components/Customer'
import Product from '@/components/Product'
import Trade from '@/components/Trade'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/customer',
    name: 'customer',
    component: Customer
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  },
  {
    path: '/trade/:customerName',
    name: 'trade',
    component: Trade
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
