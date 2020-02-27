import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../views/home.vue"
import start from "../views/start.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'start',
    component: start
  },
  {
    path: '/:user_id',
    name: 'home',
    component: home,
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
