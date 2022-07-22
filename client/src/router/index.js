import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Customer from '@/components/Customer'
import Product from '@/components/Product'
import Trade from '@/components/Trade'
import SellUint from '@/components/SellUint'
import CashMethod from '@/components/CashMethod'
import Print from '@/components/Print'




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
    path: '/sellUint',
    name: 'sellUint',
    component: SellUint
  },
  {
    path: '/cashMethod',
    name: 'cashMethod',
    component: CashMethod
  },
  {
    path: '/trade/:customerName',
    name: 'trade',
    component: Trade
  },
  {
    path: '/print',
    name: 'print',
    component: Print,
    meta: {
      header: 0
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
