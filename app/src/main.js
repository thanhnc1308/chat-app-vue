import Vue from 'vue'
import App from './App.vue'
import router from './router'

// vuesax
import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' //Vuesax styles
Vue.use(Vuesax)

// Material icons used by vuesax
import 'material-icons/iconfont/material-icons.css';

// VueNoty
import VueNoty from 'vuejs-noty'
import 'vuejs-noty/dist/vuejs-noty.css'

Vue.use(VueNoty, {
  timeout: 1000,
  progressBar: false,
  layout: 'topCenter'
})

// variable.scss
import '@/assets/scss/variable.scss'

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCircle, faCog, faEdit);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// tailwind
import '@/assets/css/tailwind.css';

// i18n
import i18n from './i18n/i18n';

//get auth from localStorage
const authData = localStorage.getItem('auth');

// Vue.use(io);
// auto scroll last message
import VueChatScroll from 'vue-chat-scroll';
Vue.use(VueChatScroll);

import store from './store';
import axios from 'axios';
import io from 'socket.io-client';
import setAuthToken from './utils/authToken';
import moment from 'moment';

Vue.config.productionTip = false

Vue.prototype.moment = moment;

let socket = null;

/** Socket IO Client - Store in Vuex State for use in components */
if (process.env.NODE_ENV === 'development') {
    socket = io('http://localhost:5000');
} else {
    socket = io('/');
}

store.dispatch('assignSocket', socket);

/** Check for auth token on refresh and set authorization header for incoming requests */
if (localStorage.authToken) {
    setAuthToken(localStorage.authToken);
} else {
    setAuthToken(null);
}

/** Axios Request Intercept */
axios.interceptors.request.use(
    function(config) {
        return config;
    },
    function(err) {
        return Promise.reject(err);
    }
);

/** Axios Response Intercept */
axios.interceptors.response.use(
    function(response) {
        return response;
    },
    function(err) {
        if (err.response.status === 401) {
            localStorage.removeItem('authToken');
            store.dispatch('toggleAuthState', false);
            router.push({
                name: 'Login',
                params: { message: 'Session has expired, please login again' }
            });
        }
        return Promise.reject(err);
    }
);


new Vue({
  router,
  i18n,
  store,
  data: {
    auth: authData ? JSON.parse(authData) : {}
  },
  render: h => h(App),
}).$mount('#app')
