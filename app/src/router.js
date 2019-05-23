import Vue from 'vue'
import Router from 'vue-router'

//import component
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Home from './views/Home.vue'

//register pluggin in Vue
//after install package, need to use Vue.use() 
Vue.use(Router);

// create a router

const router = new Router({
    mode: 'history',    //browser will ignore the hashtag # in link
    routes: [
        {   //go to /login --> it will mount to component Login
            path: '/login',
            component: Login
        },
        {
            path: '/signup',
            component: Signup
        },
        {
            path: '/',
            component: Home
        },
    ]
})

export default router;