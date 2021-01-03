import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Index from "@/views/Index";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Detail from "@/views/Detail";
import List from "@/views/List";
import UserInfo from "@/views/UserInfo";
import Order from "@/views/Order";
import Cart from "@/views/Cart";
import Buy from "@/views/Buy";
import Success from "@/views/Success";
import ResetPwd from "@/views/ResetPwd";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect: '/home',
        children: [
            {path: 'home', component: Home},
            {path: 'userInfo', component: UserInfo},
            {path: 'detail/:goodId', component: Detail},
            // {path: 'detail/:goodId', component: Detail},
            {path: 'list', component: List},
            {path: 'order', component: Order},
            {path: 'cart', component: Cart},
            {path: 'buy',name:'buy', component: Buy},
            {path: 'success', component: Success},
        ]
    },
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register},
    {path: '/reset', name: 'reset', component: ResetPwd},

    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    routes
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to,from,next)=>{
    // chrome
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
    // 验证目标地址是否为个人账号相关页面
    if((to.path==='/userInfo'||to.path==='/order'||to.path==='/cart'||to.path==='/buy'||to.path==='/success')&&window.sessionStorage.getItem("token")===null){
        next('/login')
    }else if((to.path==='/login'||to.path==='/register')&&window.sessionStorage.getItem("token")!==null){
        next('/')
    }else {
        next()
    }
})

export default router
