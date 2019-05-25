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

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  data: {
    auth: authData ? JSON.parse(authData) : {}
  },
  render: h => h(App),
}).$mount('#app')
